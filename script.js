console.log("Hello World");

let currentSong = new Audio();
let songs;
let currfolder;


//adjusting time element
currentSong.addEventListener("timeupdate", () => {
    let tim = document.getElementsByClassName("songtime")[0];

    // console.log(tim);
    // console.log(currentSong.currentTime);
    // console.log(currentSong.duration); 

    tim.innerHTML = `${Math.floor(currentSong.currentTime / 60)}:${Math.floor(currentSong.currentTime % 60)} / ${Math.floor(currentSong.duration / 60)}:${Math.floor(currentSong.duration % 60)}`; //learn for timer always
    document.getElementsByClassName('circle')[0].style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`;
});




async function getSongs(folder) {

    currfolder = folder;
    //fetching songs from the server

    let playist = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await playist.text();

    // console.log(response);





    //creating a div element to store the response

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.querySelectorAll("a");
    songs = [];
    for (let i = 0; i < as.length; i++) {
        if (as[i].href.endsWith(".mp4")) {                 //.endswith checks if the string ends with the given string
            songs.push(as[i].href.split(`/${currfolder}/`)[1]);   //splits the string into an array and takes the second part after /songs/
        }
    };



    //adding the songs to the html page
    let alist = document.getElementsByClassName("songlist")[0].querySelector("ul");  //use this to go inside a class. .query
    alist.innerHTML = "";  //clears the previous songs from the list
    for (let i = 0; i < songs.length; i++) {


        alist.innerHTML += `<li><div class="playcard">
                            <div class="music">
                            <img class="invert " src="svg/music.svg" alt="" ></img>
                            <div class="musicname">${songs[i].replaceAll("%20", " ")}</div>
                            </div>
                            <div class="playb">
                            <img src="svg/play.svg" alt="" class="msg invert">
                             </div>
                        </div>
                        </li>`        //selector  chooses the first element with ol tag

    }

    //playing songs on click of the song name

    Array.from(document.getElementsByClassName("songlist")[0].querySelectorAll(".musicname")).forEach((e) => {
        // console.log(e.innerHTML);
        e.addEventListener("click", () => {
            playSong(e.innerHTML)

        });



    })

    return songs;
}







//playing the song when clicked on the song name

// let currentSong = new Audio();
function playSong(songName) {
    const play = document.getElementsByClassName("play")[0];   //selecting the first element with class playb
    const playb = play.querySelector("img");
    currentSong.src = `${currfolder}/${songName}`;
    currentSong.play();
    playb.src = "svg/pause.svg";

    // currentSong.addEventListener("timeupdate", () => {
    //     console.log(currentSong.currentTime);
    //     console.log(currentSong.duration);
    // });




    document.getElementsByClassName("songinfo")[0].innerHTML = songName.split(".")[0].replaceAll("%20", " "); //replacing %20 with space in the song name


}

async function main() {

    // getSongs("songs/songs2");

    //manipulatinf the play button to play and pause the song

    const play = document.getElementsByClassName("play")[0];   //selecting the first element with class playb
    const playb = play.querySelector("img");

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playb.src = "svg/pause.svg";   //.src property is valid only in img and video tags
            //that is those which have the src property
            //so we have to select inside
            // ifthey are inside div                                                            
        } else {
            currentSong.pause();
            playb.src = "svg/play.svg";
        }
    })






    // adding event listener to the seekbar to change the current time of the song
    const seekbr = document.getElementsByClassName("seekbar")[0];
    seekbr.addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)
        document.querySelector(".circle").style.left = percent * 100 + "%";
        currentSong.currentTime = (percent * currentSong.duration);

    })


    let hamburg = document.getElementsByClassName("hamburger")[0].querySelector("button");
    hamburg.addEventListener("click", () => {

        document.getElementsByClassName("container1")[0].style.left = "0%";
        // document.getElementsByClassName("container1")[0].style.position = "absolute";
        document.getElementsByClassName("container1")[0].style.zIndex = "1";
        document.getElementsByClassName("close")[0].style.display = "block";
        document.getElementsByClassName("container1")[0].style.transition = "left 0.5s ease";



    })



    //close button

    let cls = document.getElementsByClassName("close")[0];
    cls.addEventListener("click", () => {
        document.getElementsByClassName("container1")[0].style.left = "-100%";
        document.getElementsByClassName("container1")[0].style.transition = "left 0.5s ease";

    })




    // adding functionality to the previous button
    const prev = document.getElementsByClassName("prev")[0];

    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`/${currfolder}/`)[1])



        if (index > 0) {
            currentSong.src = `${currfolder}/${songs[index - 1]}`;
            playSong(songs[index - 1]);



        }
    })



    //adding functionality to the next button
    const next = document.getElementsByClassName("next")[0];
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`/${currfolder}/`)[1])
        if (index + 1 < songs.length) {
            currentSong.src = `${currfolder}/${songs[songs.indexOf(currentSong.src.split(`/${currfolder}/`)[1]) + 1]}`;
            playSong(songs[index + 1]);
            // currentSong.play();
        }

    })

    //setting up volume control
    const volume = document.getElementsByClassName("volume")[0].querySelector("input");
    volume.addEventListener("input", (e) => {        //type,change are two methods we can use to detect the change in the input value. 
        // change takes effect when we set volume and leave it, while takes effect while the user is changing the value.
        currentSong.volume = parseInt(e.target.value) / 100;



    })



    //setting up mute button
    const mute = document.getElementsByClassName("vol")[0].querySelector("img")
    mute.addEventListener("click", () => {
        if (currentSong.muted) {
            currentSong.muted = false;
            mute.src = "svg/volume.svg";
            (document.getElementsByClassName("slider")[0].value=1);
                                        //or
            // document.getElementsByClassName("range")[0].style.opacity = 0;
           
        } else {
            currentSong.muted = true; 
            //          or    
            // currentSong.volume = 0;
            mute.src = "svg/mute.svg";
(document.getElementsByClassName("slider")[0].value=0);
                            //or
            // document.getElementsByClassName("range")[0].style.opacity = 0;
        }
    });


    // adding functionality to the slider button such that on increasing slider mute diappears and on decreasing slider mute appears
    const slider = document.getElementsByClassName("slider")[0];
    slider.addEventListener("input", (e) => {
        // console.log(e.target.value);
        // console.log(e.target);
        // console.log(e);
        
        if (e.target.value == 0) {
            mute.src = "svg/mute.svg";
        }
        else{
            mute.src = "svg/volume.svg";
        }
    })



    //making album functional
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async () => {
            console.log(e.dataset.folder);
            await getSongs(e.dataset.folder);
            // songs=[];



        });
    });

    //calling the displayAlbums function to display the albums dynamically
    await displayAlbums();

}


async function displayAlbums() {

    //making the addition of cards dynamic
    let playist = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await playist.text();
    let div = document.createElement("div");
    let alas = div.querySelectorAll("a");
    // console.log(div);
    let folder;
    let card2 = document.querySelector(".playlist");
    console.log(card2);
    let ar = Array.from(alas)
    for (let i = 0; i < ar.length; i++) {
        let e = ar[i];
        // console.log(e.href);
        if (e.href.includes("/songs/")) {
            folder = (e.href.split("/songs/")[1]);
            //getting metadata from the info.json file in the folder
            let p = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response2 = await p.json();

            // console.log(response2);
            card2.innerHTML += `<div data-folder="songs/${folder}" class="card">

                        <svg class="pl" width="16" height="16" viewBox="0 0 24 24" fill="black"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 20V4L19 12L5 20Z" stroke="#141834" stroke-width="1.5" stroke-linejoin="round" />

                        </svg>


                        <img src="songs/${folder}/cover.jpg" alt="" class="hits">
                        <h3>${response2.title}</h3>
                        <p>${response2.description}</p>
                    </div>`


        }
    }
    //making album functional
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async () => {
            console.log(e.dataset.folder);
            await getSongs(e.dataset.folder);
            playSong(songs[0]);




        });
    });

}





main();