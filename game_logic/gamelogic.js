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

text_creator= function(input_text){
    original_text=input_text;
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

