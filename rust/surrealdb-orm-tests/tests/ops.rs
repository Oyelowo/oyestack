use surrealdb_models::{rocket, spaceship_schema, weapon_schema, Rocket, SpaceShip, Weapon};
use surrealdb_orm::*;

#[test]
fn test_add() {
    let age = Field::new("age");
    let name = Field::new("name");
    let email = Field::new("email");
    let surname = Field::new("surname");

    let operation = (age + name) + (email + surname);

    assert_eq!(operation.query_string, "(age + name) + (email + surname)");
}

#[test]
fn test_sub() {
    let age = Field::new("age");
    let name = Field::new("name");

    let operation = age - name;

    assert_eq!(operation.query_string, "age - name");
}

#[test]
fn test_mul() {
    let age = Field::new("age");
    let name = Field::new("name");

    let operation = age * name;

    assert_eq!(operation.query_string, "age * name");
}

#[test]
fn test_div() {
    let age = Field::new("age");
    let name = Field::new("name");

    let operation = age / name;

    assert_eq!(operation.query_string, "age / name");
}

// Test more complex expressions
#[test]
fn test_complex() {
    let age = Field::new("age");
    let name = Field::new("name");
    let email = Field::new("email");
    let surname = Field::new("surname");

    let operation = (age + surname) / (name + email);

    assert_eq!(operation.query_string, "(age + surname) / (name + email)");
}

#[test]
fn test_rocket_add_field_to_real_number() {
    let rocket::Rocket {
        strength,
        bunchOfOtherFields,
        ..
    } = Rocket::schema();
    let operation = strength + 5;

    assert_eq!(operation.to_raw().build(), "strength + 5");
    assert_eq!(operation.fine_tune_params(), "strength + $_param_00000001");
}

#[test]
fn test_rocket_add_field_to_field_owned() {
    let rocket::Rocket {
        strength,
        bunchOfOtherFields,
        ..
    } = Rocket::schema();
    let operation = strength + bunchOfOtherFields;

    assert_eq!(operation.to_raw().build(), "strength + bunchOfOtherFields");
    assert_eq!(
        operation.fine_tune_params(),
        "strength + bunchOfOtherFields"
    );
}

#[test]
fn test_rocket_add_field_to_field_borrowed_plus_borrowed() {
    let rocket::Rocket {
        ref strength,
        ref bunchOfOtherFields,
        ..
    } = Rocket::schema();
    let operation = strength + bunchOfOtherFields;

    assert_eq!(operation.to_raw().build(), "strength + bunchOfOtherFields");
    assert_eq!(
        operation.fine_tune_params(),
        "strength + bunchOfOtherFields"
    );
}

#[test]
fn test_rocket_add_field_to_field_borrowed_plus_owned() {
    let rocket::Rocket {
        ref strength,
        bunchOfOtherFields,
        ..
    } = Rocket::schema();
    let operation = strength + bunchOfOtherFields;

    assert_eq!(operation.to_raw().build(), "strength + bunchOfOtherFields");
    assert_eq!(
        operation.fine_tune_params(),
        "strength + bunchOfOtherFields"
    );
}

#[test]
fn test_rocket_add_field_to_field_owned_plus_borrowed() {
    let rocket::Rocket {
        strength,
        ref bunchOfOtherFields,
        ..
    } = Rocket::schema();
    let operation = strength + bunchOfOtherFields;

    assert_eq!(operation.to_raw().build(), "strength + bunchOfOtherFields");
    assert_eq!(
        operation.fine_tune_params(),
        "strength + bunchOfOtherFields"
    );
}

// #[test]
// fn test_rocket_sub() {
//     let rocket = Rocket::schema();
//     let operation = rocket.strength - 5;
//
//     assert_eq!(operation.query_string, "strength - 5");
//     assert_eq!(
//         operation.bindings,
//         vec![
//             rocket.strength.get_bindings(),
//             NumberLike::Int(5).get_bindings()
//         ]
//         .concat()
//     );
// }
//
// #[test]
// fn test_rocket_mul() {
//     let rocket = Rocket::schema();
//     let operation = rocket.strength * 5;
//
//     assert_eq!(operation.query_string, "strength * 5");
//     assert_eq!(
//         operation.bindings,
//         vec![
//             rocket.strength.get_bindings(),
//             NumberLike::Int(5).get_bindings()
//         ]
//         .concat()
//     );
// }
//
// #[test]
// fn test_rocket_div() {
//     let rocket = Rocket::schema();
//     let operation = rocket.strength / 5;
//
//     assert_eq!(operation.query_string, "strength / 5");
//     assert_eq!(
//         operation.bindings,
//         vec![
//             rocket.strength.get_bindings(),
//             NumberLike::Int(5).get_bindings()
//         ]
//         .concat()
//     );
// }
