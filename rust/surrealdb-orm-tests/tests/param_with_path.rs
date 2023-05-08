use surrealdb_models::Student;
use surrealdb_orm::{index, this, Buildable, ToRaw, E};

#[test]
fn test_param_with_path() {
    let param_with_path = this()
        .with_path::<Student>(index(2))
        .bestFriend()
        .bestFriend()
        .course()
        .title;
    assert_eq!(
        param_with_path.fine_tune_params(),
        "$this[$_param_00000001].bestFriend.bestFriend.course.title"
    );
    assert_eq!(
        param_with_path.to_raw().build(),
        "$this[2].bestFriend.bestFriend.course.title"
    );
}

#[test]
fn test_param_with_path_no_clause() {
    let param_with_path = this()
        .with_path::<Student>(index(2))
        .bestFriend()
        .bestFriend()
        .course()
        .title;
    assert_eq!(
        param_with_path.fine_tune_params(),
        "$this[$_param_00000001].bestFriend.bestFriend.course.title"
    );
    assert_eq!(
        param_with_path.to_raw().build(),
        "$this[2].bestFriend.bestFriend.course.title"
    );
}

#[test]
fn test_param_with_path_simple() {
    let param_with_path = this().with_path::<Student>(index(2)).firstName;
    assert_eq!(
        param_with_path.fine_tune_params(),
        "$this[$_param_00000001].firstName"
    );
    assert_eq!(param_with_path.to_raw().build(), "$this[2].firstName");
}

#[test]
fn test_param_simple_clause() {
    let param_with_path = this().with_path::<Student>(E).lastName;
    assert_eq!(param_with_path.fine_tune_params(), "$this.lastName");
    assert_eq!(param_with_path.to_raw().build(), "$this.lastName");
}

#[test]
fn basic() {
    let param_with_path = this();
    assert_eq!(param_with_path.fine_tune_params(), "$this");
    assert_eq!(param_with_path.to_raw().build(), "$this");
}