class MemoryGame {
    constructor(app, arr) {
        this.app = document.getElementById(app);
        this.arr = arr;
//        arr = ['anchor', 'apple', 'barn', 'baseball', 'basketball-player', 'boxer', 'car', 'cat', 'cowboy-boot', 'duck', 'eagle', 'fish', 'golden-anchor', 'grapes', 'horse', 'house', 'jumping-horse', 'jumping', 'key', 'keys', 'lion', 'monster-truck', 'motorcycle', 'pocket-watch', 'scissors', 'seahorse', 'shark', 'shoe', 'slamdunk', 'stopwatch', 'wagon-wheel', 'wheel'];
        
        this.playBtn = document.querySelector('button');
        this.playBtn.addEventListener('click', this.initGame.bind(this));   
        this.msgBox = document.getElementById('msg-box');       
        
        this.footer = document.querySelector('footer');
        this.scoreBox = document.querySelector('#score-box');  
        this.timerBox = document.querySelector('#timer-box');
        
        // an array to keep track of choices for comparison (2 at a time)
        this.choicesArr = [];      
    }
    
    initGame() {  // when user clicks play
        // keeping score
        this.attempts = 0;
        this.matches = 0;
        this.average = 0;
        this.score = 0;
        
        // number of pairs there are
        this.totPairs = document.getElementById('difficulty').value;
        this.totPairs = Number(this.totPairs); // 12, 18, 24, or 30
        
        // keeping time
        this.totSec = 0
        this.sec = 0
        this.min = 0
        
        // this.arr is shuffled
        this.arr.sort((a, b) => 0.5 - Math.random());
        
        // slice the array from the first pic to the amount needed to display
        let gameArr = this.arr.slice(0, this.totPairs);
        // then double it, since there are pairs
        gameArr = [...gameArr, ...gameArr];

        // Loop through the shuffled array
        for(let i = 0; i < gameArr.length; i++) {
            // store one of the images that way the first image won't disappear
            let temp = gameArr[i];
            
            // randomize again so that the player won't learn exactly where the images could be
            let rando = Math.floor(Math.random() * gameArr.length); // randomize anywhere bet. 0 and the length of the game array
            
            gameArr[i] = gameArr[rando];
            gameArr[rando] = temp;
        }
        
        // Scramble again
        gameArr.sort((a, b) => 0.5 - Math.random());
        
        // output game pieces/images
        for(let i = 0; i < gameArr.length; i++) {
            let pic = new Image();
            pic.src = `img/${gameArr[i]}.jpg`;
            // pic calls showPic method on click
            pic.addEventListener('click', this.showPic.bind(this));
            // set pic class to pics
            pic.className = "pics";
            // assign name properties
            pic.name = gameArr[i]; 
            // give each pic a unique ID
            pic.id = i;
            // output the image to the app div
            this.app.appendChild(pic);
        } // end image maker for loop
        
        this.msgBox.innerHTML = "HIDING ALL IMAGES IN <span id='countdown' style='color:red; font-size:1em'>5</span> SECONDS";
        
        let countdownInterval = setInterval(() => {
            // update the countdown span tag number
            let countdown = document.getElementById('countdown');
            let countdownValue = countdown.innerHTML
            
            countdownValue = Number(countdownValue)
            countdownValue--;
            
            countdown.innerHTML = countdownValue;
            
            // when the countdown reaches 0, stop it
            if(countdownValue == 0) {
                clearInterval(countdownInterval);  
            } // end if
            
        }, 1000); // end countdown interval
   
        setTimeout(() => {
            // hide all images after 5 seconds (set img src to blank.png)

            for(let i = 0; i < gameArr.length; i++) {
                this.app.children[i].src = "img/blank.png";
            }
            
            this.timer = setInterval(() => {  
                this.totSec++
                this.sec++

                if(this.sec == 60) {
                    this.sec = 0
                    this.min++;
                }
                // these are in variables because we don't want to tamper with this.sec and this.min
                var s = this.sec;
                var m = this.min;

                if(this.sec < 10) {
                    s = "0" + this.sec;
                }

                if(this.min < 10) {
                    m = "0" + this.min;
                }
                
                this.timerBox.innerHTML = m + ':' + s;
                
                // award player higher score for choosing higher difficulty
                // score is average times total pairs squared
                this.score = Math.floor((this.average * this.totPairs ** 2) / this.totSec)
                
                this.scoreBox.innerHTML = `<p>Attempts: ${this.attempts}</p>
                                           <p>Matches: ${this.matches}</p>
                                           <p>Average: ${this.average}</p>
                                           <p>Score: ${this.score}</p>`;
                
            }, 1000);        

        }, 5000);
        
    } // end initGame()

    
    showPic() {
//        alert("Name: " + event.target.name + " " + "ID: " + event.target.id);
        event.target.src = `img/${event.target.name}.jpg`;
        this.choicesArr.push(event.target);      

        // do I have 2 items in array?
        if(this.choicesArr.length == 2) { 
            
            this.choicesArr.slice(0, 2); 
//            console.log(this.choicesArr);
            this.attempts++ // right or wrong, this counts as an attempt
            
            // how to compare
            if(this.choicesArr[0].name == this.choicesArr[1].name) { // if it matches
                // if names match, and IDs are equal
                if(this.choicesArr[0].id == this.choicesArr[1].id) {
                    
                   this.choicesArr[0].src = "img/blank.png"; 
                   this.msgBox.innerHTML = "You clicked the SAME pic twice!";
                  
                } else {
                    //names match, but IDs don't -- A legit match
                    this.msgBox.innerHTML = "Congrats! That's a match!";      
                    
                    //deactivate clickability of visible pics in the choices array. Clear the array for the next set of matches
                    let newPic0 = new Image()
                    newPic0.src = this.choicesArr[0].src
                    newPic0.className = "pics"
                    this.app.replaceChild(newPic0, this.choicesArr[0])
                    
                    let newPic1 = new Image()
                    newPic1.src = this.choicesArr[1].src
                    newPic1.className = "pics"
                    this.app.replaceChild(newPic1, this.choicesArr[1])                
                    
                    // when the next set of images is wrong, this can clear it
                    this.choicesArr = [];
                    
                    // credit player with a match
                    this.matches++ 
                    
                    // Game over?
                    if(this.matches == this.totPairs) {
                        this.msgBox.innerHTML = "GAME OVER!";
                        
                        // clear timer interval
                        clearInterval(this.timer);
                        
                        // make and output a clickable SAVE SCORE button
                        this.saveBtn = document.createElement('button');
                        this.saveBtn.innerHTML = 'SAVE SCORE';
                        this.saveBtn.className = "saveBtn";
                        this.footer.appendChild(this.saveBtn);
                        
                        // clicking it calls the saveScore() method
                        this.saveBtn.addEventListener('click', this.saveScore.bind(this));
                    }                     
                }            
            } else { // if it does not match
                
                this.msgBox.innerHTML = "Sorry, Try Again!";
                setTimeout(() => {    
                    this.choicesArr[0].src = "img/blank.png";
                    this.choicesArr[1].src = "img/blank.png";
                    this.choicesArr = [];
                }, 1200);
                
            } // end if(this.choicesArr[0].name == this.choicesArr[1].name)
            
            // calculate average and output fresh score
            this.average = (this.matches / this.attempts).toFixed(3);  
            
        } else if(this.choicesArr.length > 2) {
            
            for(let i = 0; i < this.choicesArr.length; i++) {
                this.choicesArr[i].src = "img/blank.png";
            }
            
        }
        
    } // end showPic() 
    
    // saveScore() method sends AJAX call to MySQL DB
    saveScore() {
        alert("SAVE SCORE");
    }
    
} // end class MemoryGame