#!/bin/bash

# Output file
OUTPUT_FILE="collected_files.txt"

# === MANUAL FILE LIST ===
file_list=(
  "config/db.js"
  "controllers/authController.js"
  "controllers/invoiceController.js"
  "middleware/authMiddleware.js"
  "models/Invoice.js"
  "models/User.js"
  "routes/auth.js"
  "routes/invoice.js"
  "index.js"
  "server.js"
)

# Process each file
for file_path in "${file_list[@]}"; do
    if [[ -f "$file_path" ]]; then
        {
            echo "=== $file_path ==="
            echo
            cat "$file_path"
            echo
            echo "------------------------------------"
            echo
        } >> "$OUTPUT_FILE"
    else
        echo "⚠️ Warning: File not found - $file_path" >&2
    fi
done

echo "✅ Done. Output saved to: $OUTPUT_FILE"
