class Node {
    constructor(value, ...children) {
        this.value = value;
        this.children = children;
    }
    * [Symbol.iterator]() {
        const queue = [this];
        console.log('1111', queue.length);
        while (queue.length) {
            console.log('222222', queue)
            const node = queue.shift();
            yield node.value;
            queue.push(...node.children);
        }
    }
}

const root = new Node (1, 
    new Node(2),
    new Node(3, 
        new Node(4,
            new Node(5,
                new Node(6)
            ),
            new Node(7)
        )    
    ),
    new Node(8, 
        new Node(9),
        new Node(10)    
    )    
);

console.log([...root]);

function modelProvider(paths) {
    const g = paths();
    pull();
    function pull(data) {  
        const { value, done } = g.next(data);
        if (done) {
            return;
        }
        const crumbs = value.split('.');
        const data = crumbs.reduce(followCrumbs, model);
        pull(data);
    }
}

function followCrumbs(data, crumb) {  
    if (!data || !data.hasOwnProperty(crumb)) {
        return null;
    }
    return data[crumb];
}

