#![allow(dead_code)]

use darling::{ast, util};
use proc_macro2::{Literal, TokenStream};
use quote::{format_ident, quote};

use syn;

use super::{trait_generator::MyFieldReceiver, types::CaseString};

/// A struct that contains the serialized and identifier versions of a field.
pub(crate) struct FieldIdentifier {
    /// The serialized version of the field name.
    serialized: ::std::string::String,
    /// The identifier version of the field name.
    ident: syn::Ident,
    surrealdb_field_ident: TokenStream,
    surrealdb_imported_schema_dependency: TokenStream,
    // surrealdb_field_ident: ::std::string::String,
}

/// A struct that contains the `struct_ty_fields` and `struct_values_fields` vectors.
#[derive(Debug, Default)]
pub(crate) struct FieldsNames {
    /// A vector of token streams representing the struct type fields.
    pub struct_ty_fields: Vec<TokenStream>,
    /// A vector of token streams representing the struct value fields.
    pub struct_values_fields: Vec<TokenStream>,

    pub models_serialized_values: Vec<TokenStream>,
    pub surrealdb_imported_schema_dependencies: Vec<TokenStream>,
}

impl FieldsNames {
    /// Constructs a `FieldsNames` struct from the given `data` and `struct_level_casing`.
    ///
    /// # Arguments
    ///
    /// * `data` - An `ast::Data` struct containing field receivers.
    /// * `struct_level_casing` - An optional `CaseString` representing the casing to be applied to the fields.
    pub(crate) fn from_receiver_data(
        data: &ast::Data<util::Ignored, MyFieldReceiver>,
        struct_level_casing: Option<CaseString>,
    ) -> Self {
        let fields = data
            .as_ref()
            .take_struct()
            .expect("Should never be enum")
            .fields;

        fields.into_iter().enumerate().fold(
            Self::default(),
            |mut field_names_accumulator, (index, field_receiver)| {
                let field_case = struct_level_casing.unwrap_or(CaseString::None);
                let field_ident = Self::get_field_identifier_name(field_receiver, index);
                let field_identifier_string = ::std::string::ToString::to_string(&field_ident);

                let FieldIdentifier {
                    serialized,
                    ident,
                    surrealdb_field_ident,
                    surrealdb_imported_schema_dependency,
                } = FieldCaseMapper::new(field_case, field_identifier_string)
                    .get_field_ident(&field_receiver);

                // struct type used to type the function
                field_names_accumulator
                    .struct_ty_fields
                    .push(quote!(pub #ident: &'static str));

                // struct values themselves
                field_names_accumulator
                    .struct_values_fields
                    .push(quote!(#ident: #serialized));

                field_names_accumulator
                    .models_serialized_values
                    .push(quote!(#surrealdb_field_ident));

                field_names_accumulator
                    .surrealdb_imported_schema_dependencies
                    .push(surrealdb_imported_schema_dependency);
                field_names_accumulator
            },
        )
    }

    /// Returns a `TokenStream` representing the field identifier for the given `field_receiver` and `index`.
    ///
    /// If the `field_receiver` has a named field, it returns a `TokenStream` representing that name.
    /// Otherwise, it returns a `TokenStream` representing the `index`.
    ///
    /// This function works with both named and indexed fields.
    ///
    /// # Arguments
    ///
    /// * `field_receiver` - A field receiver containing field information.
    /// * `index` - The index of the field.
    fn get_field_identifier_name(field_receiver: &MyFieldReceiver, index: usize) -> TokenStream {
        // This works with named or indexed fields, so we'll fall back to the index so we can
        // write the output as a key-value pair.
        // The index is rarely necessary since our models are usually not tuple struct
        // but leaving it as is anyways.
        field_receiver.ident.as_ref().map_or_else(
            || {
                let index_ident = ::syn::Index::from(index);
                quote!(#index_ident)
            },
            |name_ident| quote!(#name_ident),
        )
    }
}

#[derive(Debug, Clone)]
struct FieldCaseMapper {
    field_case: CaseString,
    field_identifier_string: ::std::string::String,
}

impl FieldCaseMapper {
    fn new(field_case: CaseString, field_identifier_string: ::std::string::String) -> Self {
        Self {
            field_case,
            field_identifier_string,
        }
    }

    /// Converts the field identifier string to the specified case.
    /// Also, if rename_all attribute is not specified to change the casing,
    /// it defaults to exactly how the fields are written out.
    /// However, Field rename attribute overrides this.
    pub(crate) fn to_case_string(&self) -> ::std::string::String {
        let convert_field_identifier = |case: convert_case::Case| {
            convert_case::Converter::new()
                .to_case(case)
                .convert(&self.field_identifier_string)
        };

        match self.field_case {
            CaseString::None => self.field_identifier_string.to_string(),
            CaseString::Camel => convert_field_identifier(convert_case::Case::Camel),
            CaseString::Snake => convert_field_identifier(convert_case::Case::Snake),
            CaseString::Pascal => convert_field_identifier(convert_case::Case::Pascal),
            CaseString::Lower => convert_field_identifier(convert_case::Case::Lower),
            CaseString::Upper => convert_field_identifier(convert_case::Case::Upper),
            CaseString::ScreamingSnake => {
                convert_field_identifier(convert_case::Case::ScreamingSnake)
            }
            CaseString::Kebab => convert_field_identifier(convert_case::Case::Kebab),
            CaseString::ScreamingKebab => convert_field_identifier(convert_case::Case::UpperKebab),
        }
    }

    /// Ident format is the name used in the code
    /// e.g
    /// ```
    /// struct User {
    ///     //user_name is ident and the serialized format by serde is "user_name"
    ///     user_name: String  
    /// }
    /// ```
    /// This is what we use as the field name and is mostly same as the serialized format
    /// except in the case of kebab-case serialized format in which case we fallback
    /// to the original ident format as written exactly in the code except when a user
    /// uses rename attribute on a specific field, in which case that takes precedence.
    pub(crate) fn get_field_ident(self, field_receiver: &MyFieldReceiver) -> FieldIdentifier {
        let field = self.to_case_string();
        let field = field.as_str();
        let field_ident_exact = syn::Ident::new(field, ::proc_macro2::Span::call_site());

        let surreal_schema_serializer = if field_receiver.skip_serializing {
            ::quote::quote!()
        } else {
            ::quote::quote!(pub)
        };

        let field_ident = match &self.field_case {
            // Tries to keep the field name ident as written in the struct
            //  if ure using kebab case which cannot be used as an identifier.
            // However, Field rename attribute overrides this
            CaseString::Kebab | CaseString::ScreamingKebab => &self.field_identifier_string,
            _ => field,
        };

        let field_ident = syn::Ident::new(field_ident, ::proc_macro2::Span::call_site());

        // Prioritize serde/field_getter field_attribute renaming for field string
        if let ::std::option::Option::Some(name) = field_receiver.rename.as_ref() {
            let field_renamed_from_attribute = name.serialize.to_string();
            // let field_renamed_from_attribute = syn::Ident::new(name.serialize.to_string(), ::proc_macro2::Span::call_site());

            let (surreal_model_field, surrealdb_imported_schema_dependency) =
                match field_receiver.relate.clone() {
                    Some(relation) => {
                        // ->loves->Project as fav_project
                        // let dependent_type =
                        let xx = format_ident!("{relation} as {field_renamed_from_attribute}");
                        // let ident =
                        // ::quote::quote!(#relation as #field_renamed_from_attribute)
                        (
                            ::quote::quote!(->loves->Project as fav_proj),
                            ::quote::quote!(
                                use super::ProjectSchema as Project;
                            ),
                        )
                    }
                    None => {
                        let field_renamed_from_attribute_ident =
                            format_ident!("{}", &field_renamed_from_attribute);

                        (
                            ::quote::quote!(#field_renamed_from_attribute_ident),
                            quote!(),
                        )
                    }
                };
            // let surreal_model_field = match field_receiver.relate.clone() {
            //     Some(relation) => ::quote::quote!(#relation as #field_renamed_from_attribute),
            //     None => ::quote::quote!(#field_renamed_from_attribute),
            // };

            return FieldIdentifier {
                ident: ::quote::format_ident!("{}", &field_renamed_from_attribute),
                serialized: field_renamed_from_attribute,
                // surrealdb_field_ident: syn::Ident::new(&field_renamed_from_attribute, ::proc_macro2::Span::call_site()),
                // surrealdb_field_ident: ::quote::quote!(#surreal_schema_serializer #surreal_model_field),
                surrealdb_field_ident: surreal_model_field,
                surrealdb_imported_schema_dependency,
            };
        }

        // TODO: Dededup with the above
        let (surreal_model_field, surrealdb_imported_schema_dependency) = match field_receiver
            .relate
            .clone()
        {
            Some(relation) => {
                let right_arrow_count = relation.matches("->").count();
                let left_arrow_count = relation.matches("->").count();
                let substrings = relation
                    .split("->")
                    .flat_map(|s| s.split("<-"))
                    .filter(|x| !x.is_empty())
                    .collect::<Vec<&str>>();
                let span = syn::spanned::Spanned::span(&relation);
                let start = span.start();
                let end = span.end();

                let message = format_args!(
                        "Invalid expression at  Check that your arrows are properly faced. e.g ->has->Heart or <-owned_by<-Human",
                        // &start.line,
                        // &start.column,
                        // &end.column
                    );

                if right_arrow_count > 2 || left_arrow_count > 2 || substrings.len() > 2 {
                    panic!("{}", &message);
                    // let error = syn::Error::new_spanned(2, "Input cannot be empty");
                    // return Err(error);
                }

                let string = "hello world";
                let literal = Literal::string(string);
                // let tokens: TokenStream = literal.into_token_stream();

                let direction = if right_arrow_count == 2 {
                    quote::quote!(->)
                } else {
                    quote::quote!(<-)
                };
                // let xxxx = match substrings.as_slice() {
                //     [edge_action, node_object] => {
                //         let edge_action = format_ident!("{edge_action}");
                //         let node_object = format_ident!("{node_object}");
                //         quote!(->#edge_action->#node_object)
                //     }
                //     _ => panic!("{}", &message),
                // };
                let (edge_action, node_object) = substrings.get(0).zip(substrings.get(1)).unwrap();
                let edge_action = format_ident!("{edge_action}");
                let node_object = format_ident!("{node_object}");

                // if right_arrow_count == 2 {
                //     ::quote::quote!(->loves->Project as fav_proj)
                // }
                let x = "".split("pat").collect::<Vec<_>>();
                // let strp = Literal::from("->loves->Project as fav_proj");
                let strp = map_string_to_tokenstream("->loves->Project as fav_proj");
                (
                    // ::quote::quote!(#relation as #field_ident_exact),
                    // ::quote::quote!(->loves->Project as fav_proj),
                    ::quote::quote!(#direction #edge_action #direction #node_object as #field_ident_exact),
                    // ::quote::quote!(#strp),
                    ::quote::quote!(
                        use super::ProjectSchema as Project;
                    ),
                )
            }
            None => (::quote::quote!(#field_ident_exact), quote!()),
        };

        FieldIdentifier {
            ident: field_ident.clone(),
            serialized: ::std::string::ToString::to_string(field),
            // surrealdb_field_ident: ::quote::quote!(#surreal_schema_serializer #surreal_model_field),
            // surrealdb_field_ident: ::std::string::ToString::to_string(field),
            surrealdb_field_ident: ::quote::quote!(#surreal_model_field),
            surrealdb_imported_schema_dependency: surrealdb_imported_schema_dependency,
        }
    }
}

fn map_string_to_tokenstream(string: &str) -> TokenStream {
    let literal = Literal::string(string);
    quote::quote_spanned! {literal.span()=> #literal}
}
