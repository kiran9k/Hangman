/**
 * Created by kiran on 23/3/15.
 */

/*
API methods :
1. create a new text !
2. load few random char from the text
3. for each char entered. ..check if it matches to the original
 */


var modified_text='';//modified text  changes every time user updates !
var user_attempts=[];
var key = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";
var space=['~','`','#','%','^','{','}','*','|',':'];
var text=['appleeyes','blackberryblues','gloomyeyes','bustylegs','bigblast','masterstroke','elephantsize','maester','aemong','showtimesup']

function encodeStr(uncoded) {
    uncoded = uncoded.toUpperCase().replace(/^\s+|\s+$/g,"");
    var coded = "";
    var chr;
    for (var i = uncoded.length - 1; i >= 0; i--) {
        chr = uncoded.charCodeAt(i);
        coded += (chr >= 65 && chr <= 90) ?
            key.charAt(chr - 65 + 26*Math.floor(Math.random()*2)) :
            String.fromCharCode(chr);
    }
    var coded_final='';
    for(var i in coded)
    {
        if(coded[i]==' ')
        {
            coded_final+=space[Math.floor(Math.random()*10)];
        }
        else
            coded_final+=coded[i];
    }
    return coded_final;
}

decodeStr=function(coded) {
    //coded = decodeURIComponent(coded);
    //coded=coded.replace(space_regex,' ');
    var uncoded = "";
    var chr;
    for (var i = coded.length - 1; i >= 0; i--) {
        chr = coded.charAt(i);
        uncoded += (chr >= "a" && chr <= "z" || chr >= "A" && chr <= "Z") ?
            String.fromCharCode(65 + key.indexOf(chr) % 26) :
            chr;
    }
    uncoded=uncoded.toLowerCase();
    for(var i in text) {
        uncoded = uncoded.split(text[i]).join("");
        uncoded=uncoded.split(space[i]).join(" ");
    }
    return uncoded.toUpperCase();
}

exports.getOriginalText=function()
{
    return original_text;
};

exports.getModifiedText=function()
{
    return modified_text;
};

exports.text_creator=function(data) {
    var input_text=data.text.toUpperCase();

    console.log("input "+input_text);
    a=text[Math.floor(Math.random()*10)]+input_text+text[Math.floor(Math.random()*10)];
    modified_text='';

    //generate modified text and pass it to user ! format : ^^^A^^B^^

    for (var i in input_text) {
        if (input_text.charAt(i)== ' ')
            modified_text += input_text[i];
        else if(input_text.charAt(i).match('[A-Z0-9]'))
            modified_text += '^';
        else
            modified_text += input_text[i];
    }
    var response_text={};
    response_text.modified_text=modified_text;
    response_text.token=encodeStr(a);
    response_text.user=data.token;
    return response_text;
};
/*Not used */
exports.checkAlreadyAdded=function(char){
    if(modified_text.indexOf(char.toUpperCase())){
        return true;
    }
    return false;
};
exports.getUserAttempts=function(){
    return user_attempts;
};

exports.check_char= function (data) {
    var original_text=decodeStr(data.ques_token);
    char=data.text.toUpperCase();
    var status=false;
    user_attempts.push(char);
    modified_text=data.ques_text;
    if (original_text.indexOf(char) >= 0) {
        for(var i=0;i<original_text.length;i++)
        {
            if(original_text.charAt(i)==char)
            {
                modified_text=modified_text.substr(0,i)+char.toUpperCase()+modified_text.substr(i+1);
            }
        }
        status=true;
    }
    data.ques_text=modified_text;
    data.status=status;
    data.won=check_won(original_text,modified_text);
    return data;
};


check_won=function (original_text,modified_text) {
    //returns true if its same
    console.log(original_text);
    console.log(modified_text);
    if(modified_text.length==0)
        return false;
    if(modified_text.indexOf('^')>=0)
        return false;
    return true;
};

exports.get_turn= function () {
    //task : store IP along with the turn !
    //every time IP changes, change the turn

};

/*
check_letters = function (char, postition) {
    //check if the given letters are there in the word !
    if (original_text.charAt(postition) == char) {
        return true;
    }
    else
        return false;
};

generate_random = function () {
    if (original_text.length > 5) {
        //randomly generate letters at any random position !
        var x = generate_random(2, 4);
        console.log(x);
    }
};*/
