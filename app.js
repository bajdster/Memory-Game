
const gameWindow = document.querySelector("#gameWindow");
const body = document.querySelector("body")
let playTime = document.querySelector("#playTime")
let guessedBoxes = document.querySelector("#guessedBoxes")
let bar = document.querySelector(".bar");

let boxes = document.querySelectorAll(".box")

let images = ["diamond", "games", "guitar", "musical", "pet", "soccer"]
images = images.flatMap(el=>[el,el]);

let guessingMode = false;
let currentGuess = "";
let currentNumber;

let guessedImages = 0;

let mili = 0;
let seconds = 0;
let minutes = 0;
let counter;

function startGame(images)
{
    guessedBoxes.innerHTML = `${guessedImages}/${boxes.length}` 

    for(let i = images.length-1;i>0;i--)
    {
        let j = Math.floor(Math.random()*(i+1));
        [images[i], images[j]] = [images[j], images[i]]
    }

    boxes.forEach((box, index)=>
        {
            box.innerHTML = `<img draggable = "false" class = "icon"  src = ${images[index]}.png>`;
            box.setAttribute("name", images[index])
            box.setAttribute("number", index)

            box.addEventListener('click', check);
        })
}

function checkIfGameOver()
{
    let boxesArr = Array.from(boxes)
    let isAllInvisible = boxesArr.every(box=>
    {
        return box.classList.contains("guessed")
    })

    if(isAllInvisible)
    {
        clearInterval(counter);
        gameWindow.innerHTML = `<div class = "again"><h2>Nice job! Do you want to try again?</h2>
        <p>Your time is </p>
        <span>${playTime.textContent}</span>
        <button class = "nextRound">Next Round</button>
        </div>`


        let nextRound = document.querySelector(".nextRound")
        nextRound.addEventListener('click', function()
        {
            window.location.href = window.location.href
        })
    }
}

function countPlayTime()
{
    clearInterval(counter)
    counter = setInterval(() => 
    {
       
        mili= mili+10;
        if(mili == 100)
        {
            seconds++;
            mili=0;
        }
        if(seconds==60)
        {
            minutes++
            seconds = 0;
        };
        if(minutes == 60)
        {
            alert("Time's up")
            // startGame()
        }

       playTime.innerHTML = `<div class = "displayTime">${minutes<10?"0"+minutes:minutes}:${seconds<10?"0"+seconds:seconds}:${mili}</div>`
    }, 100);
}

function check()
{

    countPlayTime();

    if(guessingMode==false)
    {
        currentGuess = this.getAttribute("name");
        currentNumber = this.getAttribute("number")
        guessingMode = true;
        this.classList.add("boxActive")
    }
    else
    {
        //same box
        this.classList.add("boxActive");
        if(this.getAttribute('number') == currentNumber)
        {
            this.classList.remove("boxActive")
            currentGuess = ""
            guessingMode = false
        }
        //founded
        else if(this.getAttribute("name")==currentGuess)
        {
            boxes[currentNumber].classList.add("guessed")
            this.classList.add("guessed")
            console.log("yes")
            //remove addEventListener from elements that are guessed
            boxes[currentNumber].removeEventListener('click', check)
            this.removeEventListener('click', check)
            guessedImages = guessedImages+2;
            guessedBoxes.innerHTML = `${guessedImages}/${boxes.length}` 
            bar.style.width = `${(guessedImages/12)*100}%`;
        }
        //not founded
        else
        {
            boxes.forEach(box=> box.removeEventListener("click", check))
            setTimeout(()=>
            {
                boxes.forEach(box=>
                    {
                        box.classList.remove("boxActive")
                        box.addEventListener("click", check)
                    })
            },1000)
        }
        currentGuess = ""
        guessingMode = false
    }

    checkIfGameOver();
}

window.addEventListener("load", startGame(images))

console.log(images)
