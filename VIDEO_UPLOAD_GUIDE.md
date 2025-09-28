# 🎥 Video Upload Guide for ByteXL Demo

## Problem
Your demo video is 95MB, which is close to GitHub's 100MB file limit and may cause issues.

## Solutions

### Option 1: YouTube Upload (Recommended)
1. Upload video to YouTube (unlisted for privacy)
2. Copy video ID from URL: `https://youtube.com/watch?v=VIDEO_ID`
3. Add to README:
```markdown
## 🎬 **Live Demo Video**
[![ByteXL Demo Video](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)
*Click to watch the full demo of ByteXL Retailer Recommendation System*
```

### Option 2: Git LFS (Large File Storage)
```bash
# Install Git LFS
git lfs install

# Track video files
git lfs track "*.mp4"
git add .gitattributes

# Add your video
git add demo-video.mp4
git commit -m "Add demo video with Git LFS"
git push origin main
```

### Option 3: Compress Video
Use online tools or ffmpeg:
```bash
# Reduce quality to decrease size
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 output.mp4
```

### Option 4: Cloud Storage Links
- **Google Drive**: Upload → Share → Copy link
- **Dropbox**: Upload → Share → Copy link
- **OneDrive**: Upload → Share → Copy link

## Recommended Approach
1. Upload to YouTube (unlisted)
2. Add video embed to README
3. Keep original file as backup

## File Size Limits
- **GitHub**: 100MB per file
- **Git LFS**: 2GB per file (paid plans)
- **YouTube**: No practical limit for demos
