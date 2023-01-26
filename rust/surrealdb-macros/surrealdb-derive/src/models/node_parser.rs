/*
Author: Oyelowo Oyedayo
Email: oyelowooyedayo@gmail.com
*/

#![allow(dead_code)]

use std::{hash::Hash};

use darling::{ast, util};
use proc_macro2::{Span, TokenStream};
use quote::{format_ident, quote};

use super::{
    casing::{CaseString, FieldIdentCased, FieldIdentUnCased},
    node::MyFieldReceiver,
    get_crate_name,
    relations::RelationType,
};

#[derive(Default, Clone)]
pub(crate) struct FieldTokenStream(TokenStream);

impl From<TokenStream> for FieldTokenStream {
    fn from(value: TokenStream) -> Self {
        Self(value)
    }
}

impl From<FieldTokenStream> for TokenStream {
    fn from(value: FieldTokenStream) -> Self {
        value.0
    }
}
impl PartialEq for FieldTokenStream {
    fn eq(&self, other: &Self) -> bool {
        self.0.to_string() == other.0.to_string()
    }
}
impl Eq for FieldTokenStream {}

impl Hash for FieldTokenStream {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        self.0.to_string().hash(state);
    }
}

#[derive(Default, Clone)]
pub struct SchemaFieldsProperties {
    /// Generated example: pub timeWritten: DbField,
    /// key(normalized_field_name)-value(DbField) e.g pub out: DbField, of field name and DbField type
    /// to build up struct for generating fields of a Schema of the SurrealdbEdge
    /// The full thing can look like:
    ///     #[derive(Debug, Default)]
    ///     pub struct Writes<Model: ::serde::Serialize + Default> {
    ///                pub id: Dbfield,
    ///                pub r#in: Dbfield,
    ///                pub out: Dbfield,
    ///                pub timeWritten: Dbfield,
    ///          }
    pub schema_struct_fields_types_kv: Vec<TokenStream>,

    /// Generated example: pub timeWritten: "timeWritten".into(),
    /// This is used to build the actual instance of the model during intialization e,g out:
    /// "out".into()
    /// The full thing can look like and the fields should be in normalized form:
    /// i.e time_written => timeWritten if serde camelizes
    //
    /// Self {
    ///     id: "id".into(),
    ///     r#in: "in".into(),
    ///     out: "out".into(),
    ///     timeWritten: "timeWritten".into(),
    /// }
    pub schema_struct_fields_names_kv: Vec<TokenStream>,

    /// Field names after taking into consideration
    /// serde serialized renaming or casings
    /// i.e time_written => timeWritten if serde camelizes
    pub serialized_field_names_normalised: Vec<String>,

    /// Generated example:
    /// type StudentWritesBlogTableName = <StudentWritesBlog as SurrealdbEdge>::TableNameChecker;
    /// static_assertions::assert_fields!(StudentWritesBlogTableName: Writes);
    /// Perform all necessary static checks
    pub static_assertions: Vec<TokenStream>,

    /// Generated example: type Book = <super::Book as SurrealdbNode>::Schema;
    /// We need imports to be unique, hence the hashset
    /// Used when you use a SurrealdbNode in field e.g: best_student: LinkOne<Student>,
    /// e.g: type Book = <super::Book as SurrealdbNode>::Schema;
    pub referenced_node_schema_imports: Vec<TokenStream>,

    /// Generated example: type Writes = super::writes_schema::Writes<Student>;
    /// The above is generated if a Student struct field uses "->Writes->Book". 
    /// Must be unique to prevent collision because it's possible for an edge to be
    /// reused.
    pub referenced_edge_schema_struct_alias: Vec<TokenStream>,

    /// Generated example:
    ///impl Writes {
    ///     pub fn book(&self, clause: #crate_name::Clause) -> Book {
    ///         Book::__________update_connection(&self.__________store, clause)
    ///     }
    /// }
    /// This helps to connect present origin node struct to destination node
    /// and it the edge itself is a struct here. This allows us to give more
    /// specific autocompletion when user accesses available destination node 
    /// from a specific edge from an origin struct.
    /// e.g Student::get_schema().writes__().book();
    /// This allows us to do `.book()` as shown above
    pub relate_edge_schema_struct_alias_impl: Vec<TokenStream>,
    
    /// Genearated example:
    /// pub fn writes__(&self, clause: Clause) -> Writes {
    ///     Writes::__________update_edge(
    ///         &self.___________store,
    ///         clause,
    ///         #crate_name::EdgeDirection::OutArrowRight,
    ///     )
    /// }
    ///  This is used within the current origin node struct e.g Student implementation
    /// e.g Student::get_schema().writes__(); 
    /// it can be writes__ or __writes depending on the arrow direction
    pub relate_edge_schema_method_connection: Vec<TokenStream>,

    /// This is used to alias a relation and uses the field name as default
    /// alias with which a relation can deserialized into
    /// Generated example:
    /// pub fn __as_book_written__(&self) -> String {
    ///     format!("{self} AS book_written")
    /// }    
    /// The above can be used for e.g ->Writes->Book as book_written
    pub relate_node_alias_method: Vec<TokenStream>,
    
    /// When a field references another model as Link, we want to generate a method for that
    /// to be able to access the foreign fields
    /// Generated Example for e.g field with best_student: line!()<Student>
    /// pub fn best_student(&self, clause: Clause) -> Student {
    ///     Student::__________update_connection(&self.__________store, clause)
    /// }
    pub record_link_fields_methods: Vec<TokenStream>,
    
    
    /// so that we can do e.g ->writes[WHERE id = "writes:1"].field_name
    /// self_instance.normalized_field_name.push_str(format!("{}.normalized_field_name", store_without_end_arrow).as_str());
    /// This generates a function that is usually called by other Nodes/Structs
    pub connection_with_field_appended: Vec<TokenStream>,
}

impl SchemaFieldsProperties {
    /// .
    ///
    /// # Panics
    ///
    /// Panics if .
    pub fn from_receiver_data(
        data: &ast::Data<util::Ignored, MyFieldReceiver>,
        struct_level_casing: Option<CaseString>,
        struct_name_ident: &syn::Ident,
    ) -> Self {
        let fields = data
            // .as_ref()
            .take_struct()
            .expect("Should never be enum")
            .fields
            .into_iter()
            .fold(Self::default(), |acc, field_receiver| {
                let field_ident = field_receiver.ident.unwrap();
                let field_type = &field_receiver.ty;
                let crate_name = get_crate_name(false);
                let uncased_field_name = ::std::string::ToString::to_string(&field_ident);
                let field_ident_cased = FieldIdentCased::from(FieldIdentUnCased {
                    uncased_field_name,
                    casing: struct_level_casing,
                });

                // get the field's proper serialized format. Renaming should take precedence
                let original_field_name_normalised = field_receiver.rename.as_ref().map_or_else(
                    || field_ident_cased.into(),
                    |renamed| renamed.clone().serialize,
                );
                let field_ident_normalised = format_ident!("{original_field_name_normalised}");
                let relationship = RelationType::from(&field_receiver);

                let field_ident_normalised_as_str =
                    if original_field_name_normalised.trim_start_matches("r#") == "in".to_string() {
                        "in".into()
                    } else {
                        field_ident_normalised.to_string()
                    };

                let referenced_node_meta = match relationship {
                    RelationType::LinkOne(node_object) => {
                        ReferencedNodeMeta::from_ref_node_meta(node_object, field_ident_normalised)
                    }
                    RelationType::LinkSelf(node_object) => {
                        ReferencedNodeMeta::from_ref_node_meta(node_object, field_ident_normalised)
                    }
                    RelationType::LinkMany(node_object) => {
                        ReferencedNodeMeta::from_ref_node_meta(node_object, field_ident_normalised)
                    }
                    RelationType::None => ReferencedNodeMeta::default(),
                };
                
                acc.static_assertions.push(referenced_node_meta.node_type_check);

                acc.schema_struct_fields_types_kv
                    .push(quote!(pub #field_ident_normalised: #crate_name::DbField).into());

                acc.schema_struct_fields_names_kv
                    .push(quote!(#field_ident_normalised: #field_ident_normalised_as_str.into()).into());

                acc.serialized_field_names_normalised
                    .push(field_ident_normalised_as_str);

                acc.connection_with_field_appended
                    .push(quote!(
                               schema_instance.#field_ident_normalised
                                     .push_str(format!("{}.{}", store_without_end_arrow, #field_ident_normalised_as_str).as_str());
                    ).into());

                acc.referenced_node_schema_imports
                    .push(referenced_node_meta.schema_import.into());

                acc.record_link_fields_methods
                    .push(referenced_node_meta.field_record_link_method.into());

                acc
            });
    fields
    }
}

#[derive(Default, Clone)]
struct ReferencedNodeMeta {
    schema_import: TokenStream,
    field_record_link_method: TokenStream,
    node_type_check: TokenStream,
}

impl ReferencedNodeMeta {
    fn from_ref_node_meta(
        node_name: super::relations::NodeName,
        normalized_field_name: ::syn::Ident,
    ) -> ReferencedNodeMeta {
        let schema_name = format_ident!("{node_name}");
        let crate_name = get_crate_name(false);
        
        // imports for specific schema from the trait Generic Associated types e.g
        // type Book = <super::Book as SurrealdbNode>::Schema;
        let schema_import = quote!(
            type #schema_name = <super::#schema_name as #crate_name::SurrealdbNode>::Schema;
        );

        let model_checks = quote!(::static_assertions::assert_impl_one!(#schema_name: #crate_name::SurrealdbNode));
        Self {
            schema_import,
            node_type_check: model_checks,
            field_record_link_method: quote!(
                pub fn #normalized_field_name(&self, clause: #crate_name::Clause) -> #schema_name {
                    #schema_name:__________update_connection(&self.__________store, clause)
                }
            ),
        }
    }
}

fn get_ident(name: &String) -> syn::Ident {
    if vec!["in", "r#in"].contains(&name.as_str()) {
        syn::Ident::new_raw(name.trim_start_matches("r#"), Span::call_site())
    } else {
        syn::Ident::new(name.as_str(), Span::call_site())
    }
}
