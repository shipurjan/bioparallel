// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

#[tauri::command]
async fn show_main_window_if_hidden(window: tauri::Window) {
    let main_window = window
        .get_window("bioparallel")
        .expect("no window labeled 'bioparallel' found");

    if let Ok(is_visible) = main_window.is_visible() {
        if !is_visible {
            main_window.show().unwrap();
        }
    }
}

#[tauri::command]
async fn close_splashscreen_if_exists(window: tauri::Window) {
    let maybe_window = window.get_window("splashscreen");

    match maybe_window {
        Some(splashscreen_window) => {
            splashscreen_window.close().unwrap();
        }
        None => {}
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![show_main_window_if_hidden, close_splashscreen_if_exists])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
