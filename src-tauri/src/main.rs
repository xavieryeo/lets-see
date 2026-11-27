#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![forbid(unsafe_code)]

fn main() {
    if let Err(error) = tauri::Builder::default().run(tauri::generate_context!()) {
        eprintln!("Failed to start lets-see: {error}");
        std::process::exit(1);
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn bootstrap_has_one_native_decorated_window() {
        let context: tauri::Context<tauri::Wry> = tauri::generate_context!();
        let windows = &context.config().app.windows;
        assert_eq!(windows.len(), 1);
        assert_eq!(windows[0].label, "main");
        assert_eq!(windows[0].title, "lets-see");
        assert!(windows[0].decorations);
    }
}
