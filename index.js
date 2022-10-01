import fetch from 'node-fetch';
import db from './models/index.js';
import { stringify } from 'querystring';
const { Department, Node, Tag } = await db();

const overpass = async (data) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: stringify({ data }),
  };
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', options);
    if (res.ok) return await res.json();
    throw new Error(res.status);
  } catch (e) {
    return await overpass(data);
  }
};

async function getAreas() {
  const json = await overpass(`
[out:json][timeout:60];
area(id:3602202162)->.searchArea;
(
  relation["boundary"="administrative"]["admin_level"="6"]["name"](area.searchArea);
);
for (t["name"])
{
  make department name=_.val;
  out;
}`);
  for (const e of json.elements) {
    const { id } = e;
    const { name } = e.tags;
    const [department] = await Department.findOrCreate({
      where: { id },
      defaults: { name },
    });
    console.log('Department', department.dataValues);
    await getNodes(department);
  }
}

async function getNodes(department) {
  const json = await overpass(`
[out:json][timeout:60];
area["name"="${department.name}"]["boundary"="administrative"]["admin_level"="6"]->.searchArea;
(
  node["generator:source"="wind"](area.searchArea);
);
out body;
>;
out qt;`);
  for (const e of json.elements) {
    const { id, lat, lon } = e;
    const [node] = await Node.findOrCreate({
      where: { id },
      defaults: { lat, lon, departmentId: department.id },
    });
    console.log('Node', node.dataValues);
    for (const [name, value] of Object.entries(e.tags)) {
      const [tag] = await Tag.findOrCreate({ where: { name, value } });
      console.log('Tag', tag.dataValues);
      node.addTag(tag);
    }
  }
}

getAreas();
