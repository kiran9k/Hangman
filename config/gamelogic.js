/**
 * Created by kiran on 23/3/15.
 */

/*
API methods :
1. create a new text !
2. load few random char from the text
3. for each char entered. ..check if it matches to the original
 */

var original_text='';//text with spaces if any
var modified_text='';//modified text  changes every time user updates !

text_creator= function(input_text){
    original_text=input_text;
    for(var i in original_text)
    {
        if(i==' ')
            modified_text+=i;
        else
            modified_text+='^';

    }
};

check_char=function(char)
{
    if(original_text.indexOf(char)>=0)
    {
        modified_text[original_text.indexOf(char)]=char.toUpperCase();
        return true;
    }
    else
        return false;//false implies the character isnt found in the text !
};


check_won=function(){
    //returns true if its same
    return original_text.localeCompare(modified_text);//remove all extra spaces and compare with modified
};

check_letters=function(char,postition)
{
    //check if the given letters are there in the word !
    if(original_text.charAt(postition)==char)
    {
        return true;
    }
    else
        return false;
};

generate_random=function()
{
    if(original_text.length>5)
    {
        //randomly generate letters at any random position !
        var x=generate_random(2,4);
        console.log(x);
    }
};

original_text="hello";
generate_random();

