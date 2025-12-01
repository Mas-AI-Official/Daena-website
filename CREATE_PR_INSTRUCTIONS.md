# 🚀 Create Pull Request - Instructions

## Option 1: Via GitHub Web Interface (Easiest)

### Step 1: Open the PR Creation Page
Click this link:
**https://github.com/Mas-AI-Official/Daena-website/pull/new/fix/mobile-1**

### Step 2: Fill in PR Details
1. **Base:** Select `main`
2. **Compare:** Should already be `fix/mobile-1`
3. **Title:** `fix(mobile): comprehensive mobile layout fixes`
4. **Description:** Copy entire content from `PR_DESCRIPTION.md` and paste it

### Step 3: Create PR
- Click "Create pull request" button
- Done! ✅

---

## Option 2: Using GitHub CLI (If Installed)

```bash
gh pr create --base main --head fix/mobile-1 --title "fix(mobile): comprehensive mobile layout fixes" --body-file PR_DESCRIPTION.md
```

---

## Option 3: Using PowerShell Script

### Prerequisites
1. Create a GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select `repo` scope
   - Copy the token

### Run Script
```powershell
# Set your token
$env:GITHUB_TOKEN = "your-token-here"

# Run the script
.\create-pr.ps1
```

---

## Option 4: Using cURL (Command Line)

```bash
# Set your token
export GITHUB_TOKEN="your-token-here"

# Create PR
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/Mas-AI-Official/Daena-website/pulls \
  -d @- << EOF
{
  "title": "fix(mobile): comprehensive mobile layout fixes",
  "head": "fix/mobile-1",
  "base": "main",
  "body": "$(cat PR_DESCRIPTION.md | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')"
}
EOF
```

---

## Quick Reference

**PR Details:**
- **Title:** `fix(mobile): comprehensive mobile layout fixes`
- **Base Branch:** `main`
- **Head Branch:** `fix/mobile-1`
- **Description:** See `PR_DESCRIPTION.md`

**Direct Link:**
https://github.com/Mas-AI-Official/Daena-website/pull/new/fix/mobile-1

---

## After PR Creation

1. ✅ Request reviews from your team
2. ✅ Add labels: `mobile`, `bug-fix`, `enhancement`
3. ✅ Begin QA testing using `docs/mobile-qa.md`
4. ✅ Monitor PR for feedback

---

**Recommended: Use Option 1 (Web Interface) - It's the easiest! 🎯**


