use actix_cors::Cors;
use actix_web::{http, web, App, HttpServer};
use graphql_mongo::configs::{index, index_playground, Configs, GraphQlApp};
use log::info;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let Configs { application, .. } = Configs::init();
    let app_url = &application.get_url();

    info!("Playground: {}", app_url);

    let schema = GraphQlApp::setup()
        .await
        .expect("Problem setting up graphql");

    // https://javascript.info/fetch-crossorigin#cors-for-safe-requests
    // https://docs.rs/actix-cors/0.5.4/actix_cors/index.html
    // http://www.ruanyifeng.com/blog/2016/04/cors.html
    // Cors short for Cross-Origin Resource Sharing.
    HttpServer::new(move || {
        let cors = Cors::default() // allowed_origin return access-control-allow-origin: * by default
            // .allowed_origin("http://localhost:3001/")
            // .allowed_origin("http://localhost:8000/")
            // .allowed_origin_fn(|origin, _req_head| origin.as_bytes().ends_with(b".localhost:3001"))
            // .allowed_origin_fn(|origin, _req_head| origin.as_bytes().ends_with(b".localhost:8000"))
            // .send_wildcard()
            .allow_any_origin() // FIXME: // remove after testing.
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![
                /* http::header::AUTHORIZATION, */ http::header::ACCEPT,
            ])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(schema.clone()))
            .service(index)
            .service(index_playground)
    })
    .bind(app_url)?
    .run()
    .await?;

    Ok(())
}
