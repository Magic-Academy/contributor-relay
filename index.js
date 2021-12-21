require('dotenv').config()
const { Octokit } = require('@octokit/core')
const fs = require('fs')
const path = require('path')

const octokit = new Octokit({
    auth: process.env.GH_TOKEN,
});

octokit.request('GET /repos/:owner/:repo/contributors', {
    owner: process.env.GH_OWNER,
    repo: process.env.GH_REPO,
}).then(result => {

    const readme = fs.readFileSync(path.resolve(__dirname, './README.md'), 'utf-8');
    const newReadme = readme.replace(/<!-- Contributors -->[\s\S]*<!-- Contributors END -->/,
        `<!-- Contributors -->
<table><tr>${result.data.map((key, index) => {
            if (index % 4 === 0) {
                return `\n</tr>\n<tr>
<td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
<a href="${key.html_url}">
<img src="${key.avatar_url}" width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=${key.name}/>
<br />
<sub style="font-size:14px"><b>${key.login}</b></sub>
</a>
</td>`
            }
            else {
                return `<td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
<a href="${key.html_url}">
<img src="${key.avatar_url}" width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=${key.name}/>
<br />
<sub style="font-size:14px"><b>${key.login}</b></sub>
</a>
</td>`
            }
        }).join('\n')}
</tr>
</table>
<!-- Contributors END -->`);
    fs.writeFileSync(path.resolve(__dirname, './README.md'), newReadme);
    //写入index.html
    const index = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8');
    const mapList = result.data.map((key, index) => {
        return ` <!-- <ul> -->
<li>
<a href="${key.html_url}">
<img src="${key.avatar_url}" />       
<span>${key.login}</span>
</a>
</li>
        <!-- </ul>  -->`
    }).join('\n');
    const newIndex = index.replace(/<!-- <ul> -->[\s\S]*<!-- <\/ul>  -->/,
        mapList);
    fs.writeFileSync(path.resolve(__dirname, './index.html'), newIndex);

})