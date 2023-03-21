/*
 * Author: Oyelowo Oyedayo
 * Email: oyelowooyedayo@gmail.com
 * Copyright (c) 2023 Oyelowo Oyedayo
 * Licensed under the MIT license
 */

pub(crate) mod attributes;
pub(crate) mod casing;
pub(crate) mod edge;
pub(crate) mod errors;
pub(crate) mod node;
pub(crate) mod parser;
pub(crate) mod relations;
pub(crate) mod variables;

use proc_macro2::{Span, TokenStream, TokenTree};
use proc_macro_crate::{crate_name, FoundCrate};
use quote::quote;

use syn::{self, Ident};

pub fn get_crate_name(internal: bool) -> TokenStream {
    if internal {
        quote! { crate }
    } else {
        let name = match crate_name("surrealdb-orm") {
            Ok(FoundCrate::Name(name)) => name,
            Ok(FoundCrate::Itself) | Err(_) => "surrealdb_orm".to_string(),
        };
        TokenTree::from(Ident::new(&name, Span::call_site())).into()
    }
}