/*
 * Author: Oyelowo Oyedayo
 * Email: oyelowooyedayo@gmail.com
 * Copyright (c) 2023 Oyelowo Oyedayo
 * Licensed under the MIT license
 */

use pretty_assertions::assert_eq;
use surreal_models::{student_schema, Student};
use surreal_orm::{index, this, where_, All, Buildable, Operatable, SchemaGetter, ToRaw, E};

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
fn test_param_with_path_with_clause() {
    let student_schema::Student { age, .. } = Student::schema();

    let param_with_path = this()
        .with_path::<Student>(where_(age.greater_than(18)))
        .bestFriend()
        .allSemesterCourses(index(5))
        .title;

    assert_eq!(
        param_with_path.fine_tune_params(),
        "$this[WHERE age > $_param_00000001].bestFriend.allSemesterCourses[$_param_00000002].title"
    );
    assert_eq!(
        param_with_path.to_raw().build(),
        "$this[WHERE age > 18].bestFriend.allSemesterCourses[5].title"
    );
}

#[test]
fn test_param_with_path_with_all_wildcard() {
    let param_with_path = this()
        .with_path::<Student>(All)
        .bestFriend()
        .allSemesterCourses(index(5))
        .title;

    assert_eq!(
        param_with_path.fine_tune_params(),
        "$this[*].bestFriend.allSemesterCourses[$_param_00000001].title"
    );
    assert_eq!(
        param_with_path.to_raw().build(),
        "$this[*].bestFriend.allSemesterCourses[5].title"
    );
}

#[test]
fn test_param_with_path_multiple_indexes() {
    let param_with_path = this()
        .with_path::<Student>(index(2))
        .bestFriend()
        .allSemesterCourses(index(5))
        .title;

    assert_eq!(
        param_with_path.fine_tune_params(),
        "$this[$_param_00000001].bestFriend.allSemesterCourses[$_param_00000002].title"
    );
    assert_eq!(
        param_with_path.to_raw().build(),
        "$this[2].bestFriend.allSemesterCourses[5].title"
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
