const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'course-data.js');

try {
    let content = fs.readFileSync(dataPath, 'utf8');
    
    // Clean existing notes block if it exists
    content = content.replace(/\/\/ Precompiled Markdown Notes[\s\S]*$/, '').trim();

    const notesObj = {};
    const files = fs.readdirSync(__dirname);

    files.forEach(file => {
        if (file.startsWith('module-') && file.endsWith('.md')) {
            const match = file.match(/^(module-\d+)/);
            if (match) {
                const id = match[1];
                const text = fs.readFileSync(path.join(__dirname, file), 'utf8');
                notesObj[id] = text;
                console.log(`Read: ${id}`);
            }
        }
    });

    const finalFile = path.join(__dirname, 'final-section-study-resources.md');
    if (fs.existsSync(finalFile)) {
        const text = fs.readFileSync(finalFile, 'utf8');
        notesObj['final-resources'] = text;
        console.log(`Read: final-resources`);
    }

    const jsonNotes = JSON.stringify(notesObj, null, 2);
    const finalOutput = content + `\n\n// Precompiled Markdown Notes for Offline Use\nCOURSE_DATA.notes = ${jsonNotes};\n`;

    fs.writeFileSync(dataPath, finalOutput, 'utf8');
    console.log("Successfully precompiled markdown notes into course-data.js!");
} catch (err) {
    console.error("Compilation error:", err);
    process.exit(1);
}
