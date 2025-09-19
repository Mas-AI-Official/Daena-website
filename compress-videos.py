#!/usr/bin/env python3
"""
Video Compression Script for Daena Demo Videos
Compresses videos to web-friendly sizes for online viewing
"""

import os
import subprocess
import sys

def compress_video(input_path, output_path, target_size_mb=10):
    """
    Compress video to target size using ffmpeg
    """
    try:
        # Get video duration first
        cmd_duration = [
            'ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
            '-of', 'csv=p=0', input_path
        ]
        duration = float(subprocess.check_output(cmd_duration).decode().strip())
        
        # Calculate target bitrate (in kbps)
        target_bitrate = int((target_size_mb * 8 * 1024) / duration)
        
        # Compression command
        cmd_compress = [
            'ffmpeg', '-i', input_path,
            '-c:v', 'libx264',
            '-crf', '28',  # Higher CRF = more compression
            '-preset', 'medium',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', '+faststart',  # Enable streaming
            '-y',  # Overwrite output file
            output_path
        ]
        
        print(f"Compressing {os.path.basename(input_path)}...")
        subprocess.run(cmd_compress, check=True)
        print(f"✅ Compressed: {os.path.basename(output_path)}")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error compressing {input_path}: {e}")
        return False
    except FileNotFoundError:
        print("❌ ffmpeg not found. Please install ffmpeg first.")
        return False

def main():
    # Video files to compress
    videos = [
        "agent communication.mp4",
        "budget calculation demo.mp4", 
        "CMP PIPELINBE DEMO.mp4",
        "patent Technology.mp4",
        "patent Technology - Made with Clipchamp.mp4",
        "REAL SENARIO DEMO.mp4",
        "real talk to daena and whole system - Made with Clipchamp.mp4"
    ]
    
    # Create compressed videos directory
    compressed_dir = "videos/compressed"
    os.makedirs(compressed_dir, exist_ok=True)
    
    print("🎬 Starting video compression for web viewing...")
    print("=" * 50)
    
    success_count = 0
    total_count = len(videos)
    
    for video in videos:
        input_path = f"videos/{video}"
        output_path = f"{compressed_dir}/{video}"
        
        if os.path.exists(input_path):
            if compress_video(input_path, output_path, target_size_mb=8):
                success_count += 1
        else:
            print(f"⚠️  File not found: {input_path}")
    
    print("=" * 50)
    print(f"✅ Compression complete: {success_count}/{total_count} videos processed")
    
    if success_count > 0:
        print("\n📁 Compressed videos saved to: videos/compressed/")
        print("🌐 Ready for online hosting!")

if __name__ == "__main__":
    main()
