#!/usr/bin/env node
import fs from "fs";
import path from "path";

const componentName = process.argv[2];
if (!componentName) {
  console.error("❌ Please provide a component name!");
  process.exit(1);
}

// ✅ Check extension (.tsx ya .jsx) mentioned hai ya nahi
let extension = "jsx";
let baseName = componentName;

if (componentName.endsWith(".tsx")) {
  extension = "tsx";
  baseName = componentName.replace(/\.tsx$/, "");
} else if (componentName.endsWith(".jsx")) {
  extension = "jsx";
  baseName = componentName.replace(/\.jsx$/, "");
}

// Component path
const componentDir = path.join("src", "components");
const componentFile = path.join(componentDir, `${baseName}.${extension}`);

// Ensure dir
fs.mkdirSync(componentDir, { recursive: true });

// Component template
const componentContent = extension === "tsx"
  ? `
import React from "react";

interface ${baseName}Props {
  // add props here
}

const ${baseName}: React.FC<${baseName}Props> = () => {
  return <div>${baseName} Component</div>;
};

export default ${baseName};
`
  : `
export default function ${baseName}() {
  return <div>${baseName} Component</div>;
}
`;

// Write file
fs.writeFileSync(componentFile, componentContent.trimStart());

console.log(`✅ Component created: ${componentFile}`);
console.log(`📌 Import with: import ${baseName} from "./components/${baseName}.${extension}";`);
