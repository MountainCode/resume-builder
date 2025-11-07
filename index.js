import { readFile, writeFile } from 'node:fs/promises';
import Mustache from 'mustache';
import childProcess from 'child_process';
import { promisify } from 'util';

const exec = promisify(childProcess.exec);

try {
  const template = await readFile('resume.md.mustache', { encoding: 'utf-8' });
  const jsonData = await readFile('data.json', { encoding: 'utf-8' });
  const data = JSON.parse(jsonData);
  const markdown = Mustache.render(
    template,
    data
  );
  await writeFile(
    './out/resume.md',
    markdown,
    { encoding: 'utf-8' }
  );
  console.log(markdown);
  const { stdout, stderr } = await exec(
    `pandoc out/resume.md -o out/resume.pdf \
       --template=template.tex \
       --pdf-engine=lualatex
`
  );
  console.log(stdout);
  console.error(stderr);
} catch(err) {
  console.error(err);
}
