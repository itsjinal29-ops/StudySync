/* =========================================
   STUDYSYNC V1
   Complete JavaScript
========================================= */

// ---------- GLOBAL VARIABLES ----------

let currentMonth = 8;      // September (0-based)
let currentYear = 2026;

let timer;
let seconds = 1500;

// ---------- LOCAL STORAGE ----------

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let examDate = localStorage.getItem("scienceExam") || "";
let darkMode = localStorage.getItem("darkMode") === "true";

// ---------- ON LOAD ----------

window.onload = function(){
    setTimeout(()=>{
const loader=document.getElementById("loader");
if(loader){
loader.style.opacity="0";
setTimeout(()=>{
loader.style.display="none";
},800);
}
},1500);

    if(darkMode){
        document.body.classList.add("dark");
    }

    renderTasks();
    renderNotes();
    generateCalendar(currentMonth,currentYear);

    if(examDate){
        document.getElementById("scienceDate").value=examDate;
    }

    updateCountdown();
};

// ---------- LOGIN ----------

function login(){

    let name = document.getElementById("studentName").value.trim();

    if(name === "") name = "Student";

    const loginScreen = document.getElementById("loginScreen");
    const app = document.getElementById("app");

    if(!loginScreen || !app){
        console.error("Login screen or app element not found.");
        return;
    }

    loginScreen.classList.add("hidden");
    app.classList.remove("hidden");

    const hour = new Date().getHours();

    let greeting = "Hello";

    if(hour < 12){
        greeting = "Good Morning";
    }else if(hour < 17){
        greeting = "Good Afternoon";
    }else{
        greeting = "Good Evening";
    }

    const welcomeText = document.getElementById("welcomeText");
    const profileName = document.getElementById("profileName");
    const todayDate = document.getElementById("todayDate");

    if(welcomeText){
        welcomeText.innerHTML = `${greeting}, ${name} 👋`;
    }

    if(profileName){
        profileName.innerHTML = name;
    }

    if(todayDate){
        todayDate.innerHTML = new Date().toDateString();
    }
}

// ---------- LOGOUT ----------

function logout(){

    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("app").classList.add("hidden");

}

// ---------- PAGE SWITCH ----------

function showPage(id){

    document.querySelectorAll(".page").forEach(page=>{
        page.classList.remove("active-page");
    });

    const targetPage = document.getElementById(id);

    if(targetPage){
        targetPage.classList.add("active-page");
    }

    document.querySelectorAll(".nav-btn").forEach(btn=>{
        btn.classList.remove("active");
    });

    document.querySelectorAll(".nav-btn").forEach(btn=>{

        if(btn.getAttribute("onclick") === `showPage('${id}')`){
            btn.classList.add("active");
        }

    });

}


// ---------- DARK MODE ----------

function toggleDarkMode(){

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );

}

// ---------- ATTENDANCE ----------

function attendanceCalc(){

    let attended=Number(document.getElementById("attended").value);
    let total=Number(document.getElementById("total").value);

    if(total<=0||attended<0||attended>total){

        alert("Enter valid numbers.");
        return;
    }

    let percentage=(attended/total)*100;
    let display=percentage.toFixed(1);

    let degrees=percentage*3.6;

    let circle=document.getElementById("attendanceCircle");

    let color="#22C55E";
    let status="Excellent";

    if(percentage<75){

        color="#EF4444";
        status="Below 75%";

    }else if(percentage<85){

        color="#F59E0B";
        status="Good";
    }

    let current=0;

let animation=setInterval(()=>{

current++;

let degree=current*3.6;

circle.style.background=
`conic-gradient(${color} ${degree}deg,
rgba(255,255,255,.2) ${degree}deg)`;

document.getElementById("attendancePercent").innerHTML=current+"%";

if(current>=Math.round(percentage)){

clearInterval(animation);

document.getElementById("attendancePercent").innerHTML=
display+"%";
if(percentage>=90){

for(let i=0;i<100;i++){

let piece=document.createElement("div");

piece.className="confetti-piece";

piece.style.left=Math.random()*100+"vw";

piece.style.background=
["#ff4d6d","#ffd166","#4ade80","#60a5fa","#a855f7"]
[Math.floor(Math.random()*5)];

piece.style.animationDelay=Math.random()+"s";

document.body.appendChild(piece);

setTimeout(()=>piece.remove(),3000);

}

}

}

},12);

    document.getElementById("attendancePercent").innerHTML=
    display+"%";

    document.getElementById("attendanceStatus").innerHTML=status;

    if(percentage>=75){

        let safe=Math.floor((attended/0.75)-total);

        document.getElementById("safeAbsences").innerHTML=safe;
        document.getElementById("classesNeeded").innerHTML="None";

    }else{

        let needed=Math.ceil((0.75*total-attended)/0.25);

        document.getElementById("safeAbsences").innerHTML="0";
        document.getElementById("classesNeeded").innerHTML=needed;
    }

    document.getElementById("dashboardAttendance").innerHTML=
    display+"%";

    document.getElementById("profileAttendance").innerHTML=
    display+"%";
}

// ---------- HOMEWORK ----------

function addTask(){

    let task=document.getElementById("taskInput").value.trim();
    let subject=document.getElementById("subjectInput").value.trim();
    let due=document.getElementById("dueDate").value;

    if(task==="") return;

    tasks.push({
        task,
        subject,
        due
    });

    localStorage.setItem("tasks",JSON.stringify(tasks));

    document.getElementById("taskInput").value="";
    document.getElementById("subjectInput").value="";
    document.getElementById("dueDate").value="";

    renderTasks();
}

function renderTasks(){

    let list=document.getElementById("taskList");

    if(!list) return;

    list.innerHTML="";

    tasks.forEach((t,index)=>{

        let li=document.createElement("li");

        li.innerHTML=
        `<div>
            <strong>${t.task}</strong><br>
            <small>${t.subject} ${t.due}</small>
        </div>
        <button onclick="removeTask(${index})">✔</button>`;

        list.appendChild(li);

    });

    document.getElementById("dashboardHomework").innerHTML=tasks.length;
    document.getElementById("profileHomework").innerHTML=tasks.length;
}

function removeTask(index){

    tasks.splice(index,1);

    localStorage.setItem("tasks",JSON.stringify(tasks));

    renderTasks();
}

// ---------- MARKS ----------

function marksCalc(){

    let maths=Number(document.getElementById("mathsMarks").value)||0;
    let science=Number(document.getElementById("scienceMarks").value)||0;
    let english=Number(document.getElementById("englishMarks").value)||0;
    let sst=Number(document.getElementById("sstMarks").value)||0;
    let guj=Number(document.getElementById("gujaratiMarks").value)||0;

    let total=maths+science+english+sst+guj;

    let percentage=(total/500)*100;

    document.getElementById("marksResult").innerHTML=
    percentage.toFixed(1)+"%";

    document.getElementById("totalMarks").innerHTML=
    total+" / 500";

    let grade="F";

    if(percentage>=90) grade="A+";
    else if(percentage>=80) grade="A";
    else if(percentage>=70) grade="B";
    else if(percentage>=60) grade="C";
    else if(percentage>=50) grade="D";

    document.getElementById("gradeResult").innerHTML=grade;
}

// ---------- TIMER ----------

function updateTimerDisplay(){

    let m=Math.floor(seconds/60);
    let s=seconds%60;

    document.getElementById("time").innerHTML=
    `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

}

function startTimer(){

    clearInterval(timer);

    timer=setInterval(()=>{

        if(seconds>0){

            seconds--;

            updateTimerDisplay();

        }else{

            clearInterval(timer);

            alert("Break Time! 🎉");
        }

    },1000);
}

function pauseTimer(){

    clearInterval(timer);

}

function resetTimer(){

    clearInterval(timer);

    seconds=1500;

    updateTimerDisplay();

}

// ---------- CALENDAR ----------

function generateCalendar(month,year){

    const grid=document.getElementById("calendarGrid");

    if(!grid) return;

    grid.innerHTML="";

    const monthYear=document.getElementById("monthYear");

    monthYear.innerHTML=
    new Date(year,month).toLocaleString("default",{
        month:"long",
        year:"numeric"
    });

    let first=new Date(year,month,1).getDay();
    let days=new Date(year,month+1,0).getDate();

    for(let i=0;i<first;i++){

        let blank=document.createElement("div");
        grid.appendChild(blank);

    }

    let today=new Date();

    for(let d=1;d<=days;d++){

        let cell=document.createElement("div");

        cell.className="calendar-day";
        cell.innerHTML=d;

        if(
            d===today.getDate()&&
            month===today.getMonth()&&
            year===today.getFullYear()
        ){

            cell.classList.add("today");
        }

        grid.appendChild(cell);

    }
}

function previousMonth(){

    currentMonth--;

    if(currentMonth<0){

        currentMonth=11;
        currentYear--;

    }

    generateCalendar(currentMonth,currentYear);
}

function nextMonth(){

    currentMonth++;

    if(currentMonth>11){

        currentMonth=0;
        currentYear++;

    }

    generateCalendar(currentMonth,currentYear);
}

// ---------- NOTES ----------

function addNote(){

    let text=document.getElementById("noteInput").value.trim();

    if(text==="") return;

    notes.push(text);

    localStorage.setItem("notes",JSON.stringify(notes));

    document.getElementById("noteInput").value="";

    renderNotes();
}

function renderNotes(){

    let grid=document.getElementById("notesGrid");

    if(!grid) return;

    grid.innerHTML="";

    notes.forEach((note,index)=>{

        let card=document.createElement("div");

        card.className="note-card";

        card.innerHTML=
        `<p>${note}</p>
        <button onclick="deleteNote(${index})">✕</button>`;

        grid.appendChild(card);

    });
}

function deleteNote(index){

    notes.splice(index,1);

    localStorage.setItem("notes",JSON.stringify(notes));

    renderNotes();
}

// ---------- EXAM COUNTDOWN ----------

function setExamDate(){

    examDate=document.getElementById("scienceDate").value;

    localStorage.setItem("scienceExam",examDate);

    updateCountdown();
}

function updateCountdown(){

    if(!examDate){

        document.getElementById("scienceCountdown").innerHTML=
        "No date selected";

        return;
    }

    let now=new Date();
    let exam=new Date(examDate);

    let diff=exam-now;

    if(diff<=0){

        document.getElementById("scienceCountdown").innerHTML=
        "Exam Day 🎯";

        return;
    }

    let days=Math.floor(diff/(1000*60*60*24));

    document.getElementById("scienceCountdown").innerHTML=
    days+" Days Left";
}

setInterval(updateCountdown,60000);

// ---------- NOTIFICATIONS ----------

function toggleNotifications(){

    document.getElementById("notificationPanel")
    .classList.toggle("hidden");

}
function updateClock(){

const now=new Date();

document.getElementById("liveClock").innerHTML=
now.toLocaleTimeString();

}

setInterval(updateClock,1000);

updateClock();