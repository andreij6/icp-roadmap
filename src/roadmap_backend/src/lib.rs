use ic_cdk_macros::{init, query, update};

#[init]
fn init() {}

#[query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[update]
fn ping() -> String {
    "pong".to_string()
}
