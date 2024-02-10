// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri_plugin_window_state::StateFlags;

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

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

#[tauri::command]
async fn read_file(path: std::path::PathBuf) -> Result<Vec<u8>, String> {
    match std::fs::read(path) {
        Ok(data) => Ok(data),
        Err(err) => Err(format!("Failed to read file: {}", err)),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);
            app.emit_all("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(
            tauri_plugin_window_state::Builder::default()
                .with_state_flags(StateFlags::all() & !StateFlags::VISIBLE)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            show_main_window_if_hidden,
            close_splashscreen_if_exists,
            read_file
        ])
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("bioparallel").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
