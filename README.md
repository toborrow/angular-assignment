# Angular Form Assignment

## Recent Updates

Hey there! 👋 I recently fixed some stuff in this project. Here's what I did:

### Bug Fixes

1. Fixed the "time" field error
   - I found this bug when I saw an error in the browser console saying "Cannot find control with name: 'time'"
   - The problem was pretty simple - we had a hidden input field in our form for "time" but we never set it up in our form controls
   - To fix it, I just removed that unused time field since we weren't using it anyway

### New Features

1. Added Skills Management
   - You can now add and remove skills from your profile
   - Type in your own skills or click on suggestions
   - Each skill shows up as a nice little tag that you can remove
   - Made sure you can't add the same skill twice

2. Better Form Validation
   - Added proper checks for all fields
   - Shows clear error messages when something's wrong
   - First and last names must be at least 2 characters
   - Age must be a real number between 0 and 150
   - Email must be valid
   - You need at least one skill

3. Better User Experience
   - Added loading states when saving
   - Shows success messages when things work
   - Shows error messages when things go wrong
   - Made the form look nicer with better styling
   - You can now press Enter to add skills

### How to Use

1. Clone the repo
2. Run `npm install`
3. Run `ng serve`
4. Open your browser to `http://localhost:4200`

### What's Next?

Still working on making things better! If you find any bugs or have ideas for new features, let me know!

### Branch Info
This work is on the branch: `eliasnhunzwe/patch-3260`