function ShowMoney(money) {
    money = money +'';
    if(money.length <= 3) {
        return money;
    }   
    else {
        var newMoney = '';
        while(money.length > 3) {
            var temp = money.substring(money.length-3);
            newMoney = '.'+ temp + newMoney;
            money = money.substring(0, money.length-3);
        }
        newMoney = money + newMoney;
        return newMoney;
    }
}

function UpdateFormatMoney() {
    var moneyList = document.getElementsByClassName('showMoney');
    for(i=0; i<moneyList.length; i++) {
        moneyList[i].innerHTML = ShowMoney(moneyList[i].innerHTML);
    }
}

UpdateFormatMoney();