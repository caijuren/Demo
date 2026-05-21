import subprocess, os

output_dir = "/Users/grubby/Desktop/Demo1/output"
video_path = os.path.join(output_dir, "temp_video.mp4")
duration = 146.0

print(f"Video duration: {duration}s")

# Narration timing (in seconds)
narration_tracks = [
    (1.0,   os.path.join(output_dir, "part1_opening.aiff")),
    (5.5,   os.path.join(output_dir, "part2_intro.aiff")),
    (22.0,  os.path.join(output_dir, "part3_click.aiff")),
    (31.0,  os.path.join(output_dir, "part4_analysis.aiff")),
    (120.0, os.path.join(output_dir, "part5_complete.aiff")),
]

inputs = [video_path]
filter_parts = []

for i, (start, path) in enumerate(narration_tracks):
    inputs.append(path)
    delay_ms = int(start * 1000)
    filter_parts.append(f"[{i+1}:a]adelay={delay_ms}|{delay_ms}[n{i}]")

narration_inputs = "".join([f"[n{i}]" for i in range(len(narration_tracks))])
narration_filter = ";".join(filter_parts)

bg_music = os.path.join(output_dir, "bg_music.wav")
inputs.append(bg_music)
bg_index = len(inputs) - 1

complex_filter = (
    f"{narration_filter};"
    f"{narration_inputs}amix=inputs={len(narration_tracks)}:duration=longest:normalize=0[narration];"
    f"[{bg_index}:a]volume=0.08[music];"
    f"[narration][music]amix=inputs=2:duration=longest:weights=1 1[audio]"
)

output_path = os.path.join(output_dir, "AI研判演示视频_final.mp4")

cmd = [
    "ffmpeg", "-y",
    "-i", video_path,
] + sum((["-i", p] for p in inputs[1:]), []) + [
    "-filter_complex", complex_filter,
    "-map", "0:v:0",
    "-map", "[audio]",
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    output_path
]

print("Running ffmpeg...")
subprocess.run(cmd)
print(f"\nFinal video: {output_path}")

result = subprocess.run(["ls", "-lh", output_path], capture_output=True, text=True)
print(result.stdout.strip())