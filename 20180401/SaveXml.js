module.exports = function(dir, name) {
    dir = dir || "/sdacrd/debug/";
    files.ensureDir(dir);
    name = name || new Date().getTime() + ".txt";
    let r = visibleToUser(true).findOne();
    while (r.parent()) {
        r = r.parent();
    }
    //shell("uiautomator dump "+dir+name,true);
    let txt = xml(r, 0);
    files.write(dir + name, txt);
};


function xml(node, i) {
    let self = t(i) + "<Node " + formatNode(node);
    if (node.childCount() === 0) {
        self += "/>";
    } else {
        self += ">";
        i++;
        for (let j = 0; j < node.childCount(); j++) {
            self += "\n" + xml(node.child(j), i);
        }
        i--;
        self += "\n" + t(i) + "</Node>";
    }
    return self;

}

function t(n) {
    let t = "";
    for (let i = 0; i < n; i++) {
        t += "\t";
    }
    return t;
}


function formatNode(node) {
    //todo more
    return node.toString();
}