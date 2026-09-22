#!/usr/bin/env python3
import os
import sys
import zipfile

def build_zip():
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_zip_path = os.path.join(project_root, 'dist', 'school-budget-plesk-windows-nodejs.zip')
    
    # Ensure dist folder exists
    os.makedirs(os.path.dirname(output_zip_path), exist_ok=True)
    
    files_to_include = [
        '.npmrc',
        'app.js',
        'server.js',
        'package.json',
        'web.config',
        'server.ts',
        'vite.config.ts',
        'tsconfig.json',
        'polyfill-node18.cjs',
        '.env.example',
        'index.html',
        'metadata.json',
        'README_PLESK_WINDOWS.md',
    ]
    
    dirs_to_include = [
        'config',
        'database',
        'src',
        'dist',
        'scripts',
    ]
    
    print(f"Building zip package at {output_zip_path}...")
    
    with zipfile.ZipFile(output_zip_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        # Add root files
        for rel_file in files_to_include:
            full_path = os.path.join(project_root, rel_file)
            if os.path.isfile(full_path):
                # Normalize slashes for Windows compatibility
                arcname = rel_file.replace('\\', '/')
                z.write(full_path, arcname)
                print(f"Added file: {arcname}")
                
        # Add directories
        for rel_dir in dirs_to_include:
            full_dir = os.path.join(project_root, rel_dir)
            if not os.path.isdir(full_dir):
                continue
                
            for root, dirs, files in os.walk(full_dir):
                # Don't include the zip file itself if it's in dist!
                for file in files:
                    if file.endswith('.zip'):
                        continue
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, project_root).replace('\\', '/')
                    z.write(file_path, rel_path)
                    
    # Verify the zip
    print("Verifying zip file integrity...")
    with zipfile.ZipFile(output_zip_path, 'r') as z_test:
        bad_file = z_test.testzip()
        if bad_file:
            print(f"ERROR: Corrupted file detected: {bad_file}")
            sys.exit(1)
        file_count = len(z_test.infolist())
        size_bytes = os.path.getsize(output_zip_path)
        print(f"SUCCESS: Zip created successfully! {file_count} files, size: {size_bytes} bytes ({size_bytes / (1024*1024):.2f} MB)")

if __name__ == '__main__':
    build_zip()
