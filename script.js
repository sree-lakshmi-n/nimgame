
function nimGame(){										// Global variables
	this.activePlayer = "Human";
	this.maxRowNum = 4;
}
nimGame.prototype.getValue = function(key){         // To get the value of global variables
  return this[key];
}
nimGame.prototype.setValue = function(key,value){		// To set the value of global variables
  this[key] = value;
}
function $(selector){																// ID selector
	return document.getElementById(selector);
}
function _(selector){
	return document.getElementsByClassName(selector);		// Class selector
}
function disableBtn(elem){														//Disables the given button
	elem.classList.add("disable-pointer");
}
function enableBtn(elem){															// Enables the given button
	elem.classList.remove("disable-pointer");
}
function displayActivePlayer(){												//result
	$('active-player').innerText = "Playing now: " + nim.getValue('activePlayer');
}

var nim = new nimGame();
generateMatches();

function generateMatches(){															// Matches generated. The game area is set.
	for(let rowNum=1; rowNum<=nim.getValue('maxRowNum'); rowNum++){
		$("game-area").innerHTML += "<div id='row"+rowNum+"' class='row'><span class='row-label' onclick=humanMove("+rowNum+")>Row"+ rowNum+"</span></div>";
		for(let i=1;i<=2*rowNum-1;i++){
			$("row"+rowNum).innerHTML += "<div class='match"+i+" match'></div>";
		}
	}
}
/* Function to hide the matches corresponding to the row clicked */
function hideMatch(rowNum) {														
	let rowChildren = $("row"+rowNum).children;           // rowNum ranges from 1 to 4.
	for(let i = 1; i <= rowChildren.length-1; i++){
		if(!(rowChildren[i].classList.contains("hide"))){
			rowChildren[i].classList.add("hide");
			break;
		}
	}
}
/* Function to show the matches. Useful when a new game begins. */
function showMatch(elem) {
	for(let i=1; i<elem.children.length; i++){
		elem.children[i].classList.remove("hide");
	}
}
/* Other rows are to be disabled when a particular row is clicked so that human can hide matches only from the row he has clicked. */
function disableOtherRows(rowNum){
	let rows = _("row");
	for(let i=0;i<nim.getValue('maxRowNum');i++){
		if((i!=rowNum)){
			rows[i].children[0].classList.add("disable-pointer");
		}
	}
}
/* Function to enable the disabled rows. */
function enableRows(){
	let rows = _("row");
	for(let i=0;i<nim.getValue('maxRowNum');i++){
			rows[i].children[0].classList.remove("disable-pointer");
		}
}
/* Function to calculate the no. of visible matches in a particular row. */
function noOfMatchesLeft(rowNum){
	let matchesLeft = 0;
	for(let i=1; i<$("row"+rowNum).children.length; i++){
		if(!($("row"+rowNum).children[i].classList.contains("hide"))){                    // If the div's classList contains 'hide', then it isn't visible
			matchesLeft += 1;
		}
	}
	return matchesLeft;
}
/************************** Comp move *************************/
function getStack(){
	let rows = _("row");
	let stacks = [0,0,0,0];
	for(let i = 0; i < rows.length; i++){
		for(let j=1; j<rows[i].children.length; j++){
			if(!(rows[i].children[j].classList.contains("hide"))){                  
				stacks[i]+=1;
			}
		}
	}
	return stacks;
}
function isAllZero(stacks){
	if(stacks.every(item => item === 0)){
		return true;
	}
	else return false;
}
function makeMove(){
	nim.setValue('activePlayer',"Comp");
	displayActivePlayer();
	let stacks = getStack();
	let optimal = optimal_move(stacks);
	if(optimal==undefined){
		for(let i=0;i<stacks.length;i++){
			if(stacks[i]!=0){
				hideMatch(i+1);
				break;
			}
		}
	}
	else{
		for(let i=0; i<optimal[1]; i++){
			hideMatch(optimal[0]+1);
		}
	}
	if(isAllZero(getStack())){
		$('result').innerText = "Human wins";
	}
	nim.setValue('activePlayer',"Human");
	disableBtn($('pc-move-btn'));
	enableRows();
}
function optimal_move(stacks) {
  var stacks_xor = stacks.reduce((r, e) => r ^ e, 0);          // nimsum calculation
	var is_endgame = stacks.reduce((r, e) => r + (e > 1), 0) < 2; //counts the no. of rows and matches remaining. Alerts if it's the last move.
  var move = stacks.reduce((move, stack, i) => {
    var take = stack - (is_endgame ^ stack ^ stacks_xor);
    return take > move[1] ? [i, take] : move;
  }, [0, 0]);
  return move[1] > 0 ? move : undefined;
}
/************************** Human move *************************/
function humanMove(rowNum){
	nim.setValue('activePlayer',"Human");
	displayActivePlayer();
	if(noOfMatchesLeft(rowNum)>0){
		disableOtherRows(rowNum-1);
		enableBtn($('pc-move-btn'));
	}															
	hideMatch(rowNum);
	nim.setValue('activePlayer',"Comp");
	if(isAllZero(getStack())){
		$('result').innerText = "Comp wins";
	}
}
/************************** New Game Reset *************************/
function newGame(){
	let rows = _("row");
	for(let i = 0; i < rows.length; i++) {
	  showMatch(rows[i]);
	}
	nim.setValue('activePlayer',"Human");
	enableBtn($('pc-move-btn'));
	enableRows();
}