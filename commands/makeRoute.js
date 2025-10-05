#!/usr/bin/env node
import fs from "fs";

const fileName = process.argv[2]; // example: contact.tsx
if (!fileName) {
  console.error("❌ Please provide a file name, e.g., make-route contact.tsx");
  process.exit(1);
}

const ext = fileName.split(".").pop();
const baseName = fileName.replace(/\.[^/.]+$/, ""); // contact

// create page file
const filePath = `src/pages/${baseName.charAt(0).toUpperCase() + baseName.slice(1)}.${ext}`;
if (fs.existsSync(filePath)) {
  console.log(`⚠️ ${filePath} already exists.`);
  process.exit(1);
}

fs.writeFileSync(filePath, `
export default function ${baseName.charAt(0).toUpperCase() + baseName.slice(1)}() {
  return <h1>📄 This is ${baseName} page</h1>;
}
`);

console.log(`✅ Created page: ${filePath}`);

// update routes
const routesFile = "src/routes/AppRoutes." + ext;
if (fs.existsSync(routesFile)) {
  let routesContent = fs.readFileSync(routesFile, "utf-8");
  if (!routesContent.includes(baseName)) {
    routesContent = `import ${baseName.charAt(0).toUpperCase() + baseName.slice(1)} from "../pages/${baseName.charAt(0).toUpperCase() + baseName.slice(1)}";\n` + routesContent;
    routesContent = routesContent.replace(
      /<Routes>([\s\S]*?)<\/Routes>/,
      `<Routes>$1\n      <Route path="/${baseName.toLowerCase()}" element={<${baseName.charAt(0).toUpperCase() + baseName.slice(1)} />} />\n    </Routes>`
    );
    fs.writeFileSync(routesFile, routesContent);
    console.log(`✅ Added route for /${baseName.toLowerCase()}`);
  }
}
