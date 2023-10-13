// todo, move all of this to configuration

function clas(name: string) {
  return `CLASS ${name.toLowerCase()} DEFINITION PUBLIC.
  PUBLIC SECTION.
ENDCLASS.

CLASS ${name.toLowerCase()} IMPLEMENTATION.

ENDCLASS.`;
}

function intf(name: string) {
  return `INTERFACE ${name.toLowerCase()} PUBLIC.

ENDINTERFACE.`;
}

function ddls(name: string) {
  return `something?`;
}

function ddlx(name: string) {
  return `something?`;
}

function drty(name: string) {
  return `something?`;
}

function dteb(name: string) {
  return `something?`;
}

export const affExtras: {[sdf: string]: {contents: (name: string) => string, extension: string}[]} = {
  "clas": [{contents: clas, extension: "abap"}],
  "ddls": [{contents: ddls, extension: "acds"}],
  "ddlx": [{contents: ddlx, extension: "acds"}],
  "drty": [{contents: drty, extension: "acds"}],
  "dteb": [{contents: dteb, extension: "acds"}],
  "intf": [{contents: intf, extension: "abap"}],
};