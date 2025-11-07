import { readFile, writeFile } from 'node:fs/promises';
import Mustache from 'mustache';
import childProcess from 'child_process';
import { promisify } from 'util';
import { parse } from 'yaml';
import _ from 'lodash';

const exec = promisify(childProcess.exec);

try {
  const template = await readFile('resume.md.mustache', { encoding: 'utf-8' });
  const jsonData = await readFile('data.json', { encoding: 'utf-8' });
  const yamlData = await readFile('data.yml', { encoding: 'utf-8'});
  const data = _.merge(JSON.parse(jsonData), parse(yamlData));
  const dataForView = {
    ...data,
    skills_by_category: data.skills_by_category.map(
      ({category, skills}) => {
        const sortedSkills = skills.slice().sort();
        return {
          category,
          first_skill: sortedSkills[0],
          remaining_skills: sortedSkills.slice(1)
        };
      }
    )
  };
  const markdown = Mustache.render(
    template,
    dataForView
  );
  await writeFile(
    './out/resume.md',
    markdown,
    { encoding: 'utf-8' }
  );
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
