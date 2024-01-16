import blocksData from "../blocks.json" assert { type: 'json' };


function findOptimalPlace(container, blocks) {
    blocks.sort((a, b) => b.width * b.height - a.width * a.height);

    const placedBlocks = [];

    for (let block of blocks) {
        let placed = false;

        for (let rotated = 0; rotated < 2; rotated++) {
            for (let y = 0; y <= container.height - block.height && !placed; y++) {
                for (let x = 0; x <= container.width - block.width && !placed; x++) {
                    placed = placeBlock(container, placedBlocks, block, x, y, rotated);
                }
            }
        }
    }

    return { container, blocks: placedBlocks };
} //Sorting blocks by their area and iteration of all possible positions


function placeBlock(container, blocks, block, x, y, rotated) {
    const [width, height] = rotated ? [block.height, block.width] : [block.width, block.height];

    if (x + width > container.width || y + height > container.height) {
        return false;
    }

    for (let placedBlock of blocks) {
        if (
            x < placedBlock.x + placedBlock.width &&
            x + width > placedBlock.x &&
            y < placedBlock.y + placedBlock.height &&
            y + height > placedBlock.y
        ) {
            return false;
        }
    }

    block.x = x;
    block.y = y;
    block.placed = true;
    blocks.push(block);
    return true;
} //Checking whether a block can be placed in a given position and orientation and whether it overlaps with other placed blocks


function displayBlocks(container, blocks) {
    const containerElement = document.getElementById('container');
    containerElement.innerHTML = '';

    const colorMap = {};

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const blockElement = document.createElement('div');
        blockElement.className = 'block';
        blockElement.style.width = `${block.width}px`;
        blockElement.style.height = `${block.height}px`;

        const color = colorMap[`${block.width}-${block.height}`] || getRandomColor();
        blockElement.style.backgroundColor = color;
        blockElement.textContent = i;

        blockElement.style.top = `${block.y}px`;
        blockElement.style.left = `${block.x}px`;
        containerElement.appendChild(blockElement);


        colorMap[`${block.width}-${block.height}`] = color;
    }
} //Displaying blocks on the page, creating <div> elements for each block, setting their size and position, and adding them to the container


function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, 0)}`;
}



function calculateFullness(container, blocks) {
    let internalCavities = 0;

    for (let y = 0; y < container.height; y++) {
        for (let x = 0; x < container.width; x++) {
            let isCavity = true;

            for (let block of blocks) {
                if (
                    x >= block.x &&
                    x < block.x + block.width &&
                    y >= block.y &&
                    y < block.y + block.height
                ) {
                    isCavity = false;
                    break;
                }
            }

            if (isCavity) {
                internalCavities++;
            }
        }
    }

    const totalArea = container.width * container.height;
    const blockArea = blocks.reduce((acc, block) => acc + block.width * block.height, 0);
    const fullness = 1 - internalCavities / (internalCavities + blockArea);

    document.getElementById('fullness').innerText = `Fullness: ${fullness.toFixed(2) * 100}`;

    return fullness;
} //Determination of the number of internal cavities by iteration, calculation of the coefficient of useful use of space


window.addEventListener('resize', () => {
    container.width = window.innerWidth * 0.8;
    const updatedResult = findOptimalPlace(container, blocks);
    displayBlocks(updatedResult.container, updatedResult.blocks);
    calculateFullness(updatedResult.container, updatedResult.blocks);
}) //Automatic enumeration of the location of blocks and display of the updated result on the page



//Example of use
const container = { width: 764, height: 764 };
const blocks = blocksData;

const result = findOptimalPlace(container, blocks);
displayBlocks(result.container, result.blocks);
calculateFullness(result.container, result.blocks);
