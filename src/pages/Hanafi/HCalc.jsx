import { useLocation } from "react-router-dom";
import "../../css/allawy.css"
import { useEffect, useState } from "react";

function Cart() {

  const location = useLocation();
  const {list} = location.state || { list:[] };
  const {kinship} = location.state || { kinship:false };
  const [table, setTable] = useState([]);
  const [group, setgroup] = useState({});
  const [calculation, setCalc] = useState(0);
  const [breaking, setBr] = useState(1);
  const [increament, setInc] = useState(0);
  const [decreament, setDec] = useState(0);
  const [inheritage, setInh] = useState(0);


  useEffect(()=>{

    function checkO(data){
      for (let i = 0; i<data.length; i++){
        for (let j = 0; j<data.length; j++){
          for (let k = 0; k<data.length; k++){
            if (data[i].name == 'الزوج' && data[j].name == 'الأم' && data[k].name == 'الأب' && list.filter(data => data.con == 'leaf').length == 0){
              return true;
            }else if (data[i].name == 'الزوجة' && data[j].name == 'الأم' && data[k].name == 'الأب' && list.filter(data => data.con == 'leaf').length == 0){
              return true
            }
          }
        }
      }
    }

    function checkForce(data, compare){
      data = data.filter(item => item.ID !== compare.ID)
      for (let i = 0; i<data.length; i++){
        if (data[i].gen == compare.gen && data[i].con == compare.con && data[i].rel == compare.rel && data[i].sex !== compare.sex){
          return true
        }
      }
      return false
    }
    
    function checkEqual(data, compare){
      data = data.filter(item => item.ID !== compare.ID)
      for (let i = 0; i<data.length; i++){
        if (data[i].gen == compare.gen && data[i].con == compare.con && data[i].rel == compare.rel && data[i].sex == compare.sex){
          return true
        }
      }
      return false
    }

    function priorety(){
      let males = list.filter(data => data.sex == 'male' && data.con !== 'marriage' && data.rel !== 'Mother Side');
      let females = list.filter(data => data.sex == 'female' && data.con !== 'marriage' && data.rel !== 'Mother Side');
  
      kinship ? males.length == 0 ? males = females : '' : '';

      if(males.filter(data => data.con == 'leaf').length !== 0){
        males = males.filter(data => data.con == 'leaf');
        females = females.filter(data => data.con == 'leaf');
        for (let i = 1; i <= 3; i++) {
          if(males.filter(data => data.gen == i).length !== 0){
            let outcome = checkForce(list, males.filter(data => data.gen == i)[0]) ?
              [males.filter(data => data.gen == i), females.filter(data => data.gen == i)]  : [males.filter(data => data.gen == i)]
              return { array:outcome, force:checkForce(list, outcome[0][0]) }
          }
        }
      } else if(males.filter(data => data.con == 'root').length !== 0 && !checkO(list)){
        males = males.filter(data => data.con == 'root');
        females = females.filter(data => data.con == 'root');
        for (let i = -1; i >= -3; --i) {
          if(males.filter(data => data.gen == i).length !== 0){
            return { array:[males.filter(data => data.gen == i)], force:false }
          }
        }
      } else if(males.filter(data => data.con == 'sibling' || data.con == 'nephew').length !== 0){
        males = males.filter(data => data.con == 'sibling' || data.con == 'nephew');
        females = females.filter(data => data.con == 'sibling' || data.con == 'nephew');
        for (let i = 0; i <= 3; i++) {
          if(males.filter(data => data.gen == i && data.rel == 'Both Side').length !== 0){
            males = males.filter(data => data.rel == 'Both Side');
            females = females.filter(data => data.rel == 'Both Side');
            let outcome = i < 2 ? checkForce(list, males.filter(data => data.gen == i)[0]) ?
              [males.filter(data => data.gen == i), females.filter(data => data.gen == i)]  : [males.filter(data => data.gen == i)] : [males.filter(data => data.gen == i)]
            return { array:outcome, force: i < 2 ? checkForce(list, outcome[0][0]) : false }
          } else if(males.filter(data => data.gen == i && data.rel == 'Father Side').length !== 0){
            males = males.filter(data => data.rel == 'Father Side');
            females = females.filter(data => data.rel == 'Father Side');
            let outcome = i < 2 ? checkForce(list, males.filter(data => data.gen == i)[0]) ?
              [males.filter(data => data.gen == i), females.filter(data => data.gen == i)]  : [males.filter(data => data.gen == i)] : [males.filter(data => data.gen == i)]
            return { array:outcome, force: i < 2 ? checkForce(list, outcome[0][0]) : false }
          }
        }
      } else if(males.filter(data => data.con == 'uncle' || data.con == 'cousin').length !== 0){
        females = males.filter(data => data.con == 'uncle' || data.con == 'cousin');
        females = males.filter(data => data.con == 'uncle' || data.con == 'cousin');
        for(let i = -1; i >= -3; --i){
          for (let j = i; j < i+2; j++) {
            if(males.filter(data => data.gen == j && data.rel == 'Both Side').length !== 0){
              males = males.filter(data => data.rel == 'Both Side');
              females = females.filter(data => data.rel == 'Both Side');
              let outcome = [males.filter(data => data.gen == j)]
            return { array:outcome, force:false }
            } else if(males.filter(data => data.gen == j && data.rel == 'Father Side').length !== 0){
              males = males.filter(data => data.rel == 'Father Side');
              females = females.filter(data => data.rel == 'Father Side');
              let outcome = [males.filter(data => data.gen == j)]
            return { array:outcome, force:false }
            }
          }
        }
      } else if(list.filter(data => data.con == 'obedience').length !== 0){
        let outcome = list.filter(data => data.con == 'obedience');
        let force = false;
        if(males.filter(data => data.con == 'obedience').length !== 0 && females.filter(data => data.con == 'obedience').length !== 0){
          outcome = [males.filter(data => data.con == 'obedience'), females.filter(data => data.con == 'obedience')]
          force = true;
        } else if(males.filter(data => data.con == 'obedience').length !== 0){
          outcome = [males.filter(data => data.con == 'obedience')]
        } else if(females.filter(data => data.con == 'obedience').length !== 0){
          outcome = [females.filter(data => data.con == 'obedience')]
        }
        return { array:outcome, force }
      }

      return { array:[], force:false}
    }

    function handleGrandma(){
      let MSG = list.filter(data => data.sex == 'female' && data.con == 'root' && data.rel == 'Mother Side');
      let FSG = list.filter(data => data.sex == 'female' && data.con == 'root' && data.rel == 'Father Side');
      let check = false;

      if(list.filter(data => data.title == 'الأم').length == 0){
        if([...MSG, ...FSG].length !== 0){
          for(let i = -2; i >= -3; --i){
            list.filter(data => data.con == 'root' && data.gen > i && data.rel == 'Father Side').length !== 0 ?
            FSG.filter(data => data.gen > i): FSG;
            if(MSG.filter(data => data.gen == i).length !== 0){
              MSG = MSG.filter(data => data.gen == i);
              FSG = FSG.filter(data => data.gen == i);
              return { array:[...MSG,...FSG], check:true }
            } else if(FSG.filter(data => data.gen == i).length !== 0){
              FSG = FSG.filter(data => data.gen == i);
              MSG = MSG.filter(data => data.gen == i);
              return { array:[...MSG,...FSG], check:true }
            }
          }
        }
      }
      return { array:[...MSG,...FSG], check }
    }

//the measurements
    let tableSubstitude = [];
    let numbers = [];
    let count = 0;
    let IDs = [];

//the omary measurement
    if (checkO(list)) {
      let name = list.filter(data => data.con == 'marriage')[0].title;

      group[name] = name == 'الزوج' ? { count:1, data:list.filter(data => data.con == 'marriage'), item: {
        ID: 1,
        name: name,
        share: '1/2',
        upper: 1,
        lower: 2
      }} : { count: list.filter(info => info.con == 'marriage').length, data:list.filter(data => data.con == 'marriage'), item: {
        ID: 1,
        name: name,
        share: '1/4',
        upper: 1,
        lower: 4
      }}
      name == 'الزوج' ? numbers.push(6) : numbers.push(4);
      group['الأم'] = { count:1, data:list.filter(data => data.title == 'الأم'), item: {
        ID: 2,
        name: 'الأم',
        share: '1/3 ب',
        upper: 1,
        lower: 3,
        omar: true
      }}
      numbers.push(1);
      group['الأب'] = { count:1, data:list.filter(data => data.title == 'الأب'), item: {
        ID: 3,
        name: 'الأب',
        share: '2/3 ب',
        upper: 2,
        lower: 3,
        omar: true
      }}
      numbers.push(1);
      IDs = [...list.filter(data => data.title == 'الزوج' || data.title == 'الزوجة' || data.title == 'الأب' || data.title == 'الأم').map(data => data.ID)];
    }

// the half measurement
    list.forEach(data => {
      let confirm = false;

      switch(data.title){
        case 'الزوج': if(list.filter(info => info.con == 'leaf').length == 0 && !checkO(list)){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'البنت': if(!checkForce(list, data) && !checkEqual(list, data)){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'بنت الإبن': if(!checkForce(list, data) && !checkEqual(list, data) && list.filter(info => info.con == 'leaf' && info.gen < data.gen).length == 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'بنت إبن الإبن': if(!checkForce(list, data) && !checkEqual(list, data) && list.filter(info => info.con == 'leaf' && info.gen < data.gen).length == 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'الأخت الشقيقة': if(!checkForce(list, data) && !checkEqual(list, data) && list.filter(info => info.con == 'leaf' || (info.con == 'root' && info.sex == 'male')).length == 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'الأخت لأب': if(!checkForce(list, data) && !checkEqual(list, data) && list.filter(info => info.con == 'leaf' || (info.con == 'root' && info.sex == 'male') || (info.con == 'sibling' && info.rel == 'Both Side')).length == 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;
      }

      if(confirm){
        group[data.title] = {count:1, data: list.filter(info => info.title == data.title), item: {
          ID: data.ID,
          name: data.title,
          share: '1/2',
          upper: 1,
          lower: 2
        }}
        numbers.push(2);
      }
    });

//the quarter measurement
    list.forEach(data => {
      let confirm = false;
      
      switch(data.title){
        case 'الزوج': if(list.filter(info => info.con == 'leaf').length > 0 && !checkO(list)){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'الزوجة': if(list.filter(info => info.con == 'leaf').length == 0 && !checkO(list)){
          confirm = true;
          IDs.push(data.ID);
        }
        break;
      }

      if(confirm){
        group[data.title] = { count: list.filter(info => info.title == data.title).length, data: list.filter(info => info.title == data.title), item: {
          ID: data.ID,
          name: data.title,
          share: '1/4',
          upper: 1,
          lower: 4
        }}
        numbers.push(4);
      }
    });

//the hexo measurement
    list.forEach(data => {
      let confirm = false;
      
      switch(data.title){
        case 'الزوجة': if(list.filter(info => info.con == 'leaf').length > 0 && !checkO(list)){
          confirm = true;
          IDs.push(data.ID);
        }
        break;
      }

      if(confirm){
        group[data.title] = { count: list.filter(info => info.title == data.title).length, data: list.filter(info => info.title == data.title), item: {
          ID: data.ID,
          name: data.title,
          share: '1/8',
          upper: 1,
          lower: 8
        }}
        numbers.push(8);
      }
    });

//the two thirds measurement
    list.forEach(data => {
      let confirm = false;
      
      switch(data.title){

        case 'البنت': if(!checkForce(list, data) && checkEqual(list, data)){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'بنت الإبن': if(!checkForce(list, data) && checkEqual(list, data) && list.filter(info => info.con == 'leaf' && info.gen < data.gen).length == 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'بنت إبن الإبن': if(!checkForce(list, data) && checkEqual(list, data) && list.filter(info => info.con == 'leaf' && info.gen < data.gen).length == 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'الأخت الشقيقة': if(!checkForce(list, data) && checkEqual(list, data) && list.filter(info => info.con == 'leaf' || (info.con == 'root' && info.sex == 'male')).length == 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'الأخت لأب': if(!checkForce(list, data) && checkEqual(list, data) && list.filter(info => info.con == 'leaf' || (info.con == 'root' && info.sex == 'male') || (info.con == 'sibling' && info.rel == 'Both Side')).length == 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;
      }

      if(confirm){
        group[data.title] = { count:list.filter(info => info.title == data.title).length, data: list.filter(info => info.title == data.title), item: {
          ID: data.ID,
          name: data.title,
          share: '2/3',
          upper: 2,
          lower: 3
        }}
        numbers.push(3);
      }
    });

//the one third measurements
    list.forEach(data => {
      let confirm = false;
      let name;

      switch(data.title){
        case 'الأم': if((list.filter(info => info.con == 'leaf').length == 0 && list.filter(info => info.con == 'sibling').length < 2) && !checkO(list)){
          confirm = true;
          name = data.title;
          IDs.push(data.ID);
        }
        break;
        default: if(data.title == 'الأخ لأم' || data.title == 'الأخت لأم'){
          if(list.filter(info => info.con == 'leaf' || (info.con == 'root' && info.sex == 'male')).length == 0 && list.filter(info => info.con == 'sibling' && info.rel == 'Mother Side').length > 1){
            confirm = true;
            name = 'الإخوة لأم';
            IDs.push(data.ID);
          }
        }
        break;
      }

      if(confirm){
        group[name] = { count:list.filter(info => info.title == data.title).length, 
          data: data.title == ('الأخ لأم' || 'الأخت لأم') ? list.filter(info => info.con == 'sibling' && info.rel == 'Mother Side') : list.filter(info => info.title == data.title), item: {
          ID: data.ID,
          name: data.title,
          share: '1/3',
          upper: 1,
          lower: 3
        }}
        numbers.push(3);
      }
    });

//the hexo measurements
    list.forEach(data => {
      let confirm = false;
      let daughterhalf = group['البنت'] ? group['البنت'].item.share == '1/2' ? true : false : false;
      let granddaughterhalf = group['بنت الإبن'] ? group['بنت الإبن'].item.share == '1/2' ? true : false : false;
      let sisterhalf = group['الأخت الشقيقة'] ? group['الأخت الشقيقة'].item.share == '1/2' ? true : false : false;

      switch(data.title){

        case 'الأب': if(list.filter(info => info.con == 'leaf').length > 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'الأم': if(list.filter(info => info.con == 'leaf').length > 0 || list.filter(info => info.con == 'sibling').length > 1){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'أب الأب': if(list.filter(info => info.con == 'leaf').length > 0 && list.filter(info => info.gen > info.gen && info.con == 'root').length == 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;
        
        case 'أب أب الأب': if(list.filter(info => info.con == 'leaf').length > 0 && list.filter(info => info.gen > info.gen && info.con == 'root').length == 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'بنت الإبن':if (daughterhalf && !checkForce(list, data)){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'بنت إبن الإبن':if (granddaughterhalf && !checkForce(list, data)){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'الأخت لأب': if (sisterhalf && !checkForce(list, data)){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        default: if(data.title == 'الأخ لأم' || data.title == 'الأخت لأم'){
          if(list.filter(info => info.con == 'leaf' || (info.con == 'root' && info.sex == 'male')).length == 0 && list.filter(info => info.con == 'sibling' && info.rel == 'Mother Side').length == 1){
            confirm = true;
            IDs.push(data.ID);
          }
        }
        break;
      }

      if(confirm){
        group[data.title] = { count:list.filter(info => info.title == data.title).length, data: list.filter(info => info.title == data.title), item: {
          ID: data.ID,
          name: data.title,
          share: '1/6',
          upper: 1,
          lower: 6
        }}
        numbers.push(6);
      }
    });
    if(handleGrandma().check == true){
      group[handleGrandma().array[0].title] = { count:handleGrandma().array.length, data:handleGrandma().array, item: {
        ID: handleGrandma().array[0].ID,
        name: handleGrandma().array.title,
        share: '1/6',
        upper: 1,
        lower: 6
      }
    }
      numbers.push(6);
      IDs = [...IDs, ...handleGrandma().array.map(data => data.ID)]
    }

// the force measurement
    list.forEach(data => {
      let confirm = false;

      switch(data.title){

        case 'الأخت الشقيقة': if(!checkForce(list, data) && list.filter(info => (info.con == 'leaf' && info.sex == 'male') || (info.con == 'root' && info.sex == 'male')).length == 0 && list.filter(info => info.con == 'leaf' && info.sex == 'female').length !== 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;

        case 'الأخت لأب': if(!checkForce(list, data) && list.filter(info => (info.con == 'leaf' && info.sex == 'male') || (info.con == 'root' && info.sex == 'male') || (info.con == 'sibling' && info.rel == 'Both Side')).length == 0 && list.filter(info => info.con == 'leaf' && info.sex == 'female').length !== 0){
          confirm = true;
          IDs.push(data.ID);
        }
        break;
      }

      if(confirm){
        group[data.title] = { count: list.filter(info => info.title == data.title).length, force: false, data: list.filter(info => info.title == data.title), item: {
            ID: data.ID,
            name: data.title,
            share: 'ع',
            upper: 1,
            lower: 1
          }}
         numbers.push(1);
      }
    })

    let trues = numbers;
    for (let i = 0; i < trues.length; i++) {
      trues = [trues[i], ...trues.filter(data => data !== trues[i])];
    }
    if(priorety().array.length !== 0 && priorety().force){
      let mcount = priorety().array[0].length;
      let fcount = priorety().array[1].length;
      group[priorety().array[0][0].title] = { count: mcount*2 + fcount, mdata:priorety().array[0], fdata:priorety().array[1],
        data:[...priorety().array[0], ...priorety().array[1],], force: true, item: {
        ID: priorety().array[0][0].ID,
        share: 'ع',
        upper: 1,
        lower: 1,
        mcount, fcount
      }}
      numbers.push(1);
      IDs = [...IDs, ...priorety().array[0].map(data => data.ID), ...priorety().array[1].map(data => data.ID)]
    } else if(priorety().array.length !== 0){
      count = priorety().array[0].length;
      group[priorety().array[0][0].title] = { count, data:priorety().array[0], force: false, item: {
        ID: priorety().array[0][0].ID,
        name: priorety().array[0][0].title,
        share: 'ع',
        upper: 1,
        lower: 1
      }}
      numbers.push(1);
      IDs = [...IDs, ...priorety().array[0].map(data => data.ID)]
    }
    

// the neglect measurement
    list.forEach(data => {
      if(IDs.includes(data.ID) === false){
        group[data.title] = { count: list.filter(info => info.title == data.title).length, data:list.filter(info => info.title == data.title), item: {
              ID: data.ID,
              name: data.title,
              share: 'م',
              worth:0
        }}
      }
    })

    //the calculation proccess
    function calculate(numbers){
      numbers = numbers.filter(data => data !== 0);
      let execution = 1;
        for (let i = 0; i < numbers.length; i++) {
          for (let j = 0; j < numbers.length; j++) {
            if(i!==j){
              if(numbers[i] == numbers[j]){
                execution = numbers[i];
                numbers.splice(j,1);
              }
            } else if(numbers.length == 1){
              execution = numbers[0];
            }
          }
        }
        for (let i = 0; i < numbers.length; i++) {
          for (let j = 0; j < numbers.length; j++) {
            if(i!==j){
              if(numbers[i] % numbers[j] == 0){
                execution = numbers[i];
                numbers.splice(j,1);
              }
            }
          }
        }
        for (let i = 0; i < numbers.length; i++) {
          for (let j = 0; j < numbers.length; j++) {
            if(i!==j){
                if(numbers[i] % 2 == 0 && numbers[j] % 2 == 0){
                  execution = numbers[i] / 2 * numbers[j];
                  numbers.splice(i,1);
                } else
                if(numbers[i] % numbers[j] !== 0 && numbers[j] % numbers[i] !== 0){
                  execution = numbers[i]*numbers[j];
                  numbers.splice(i,1);
                }
            }
          }
        }
      
      return execution;
    }
    // compute base calculation locally to avoid relying on async state update
    setCalc(calculate(numbers));

    function addWorth(){
      let sum = 0;
      let notomar = 0;

      for(const name in group){
        const upper = group[name].item.upper;
        const lower = group[name].item.lower;
        const omar = group[name].item.omar;
        const share = group[name].item.share;

        if(upper / lower !== 1 && omar !== true && share !== 'م'){
          group[name] = { ...group[name], item:{...group[name].item, worth: calculation * (upper / lower)} }
          sum += calculation * (upper / lower); notomar +=calculation * (upper / lower);
        } else if(omar === true){
          group[name] = { ...group[name], item:{...group[name].item, worth: (calculation - notomar) * (upper / lower)} }
          sum += (calculation - notomar) * (upper / lower);
        } else if(lower === 1){
          group[name] = { ...group[name], item:{...group[name].item, share: sum === 0 ? 'ع' : 'ب', worth: calculation - sum} }
          sum += calculation - sum;
        }
      }

      if(sum > calculation){
        setInc(sum);
      } else if(sum < calculation && list.filter(data => data.con == 'marriage').length !== 0 &&list.filter(data => data.con !== 'marriage').length !== 0){
        let substitude = 1;
        let sum = 0;
        for(const name in group){
          const upper = group[name].item.upper;
          const lower = group[name].item.lower;
          const count = group[name].count;
          if(group[name].data[0].con == 'marriage'){
            group[name] = { ...group[name], item:{...group[name].item, worth: upper} }
            substitude = lower;
            sum = lower - upper;
            for(let n=0;n<count;n++){
              for(let i=0; i<numbers.length; i++){
                if(numbers[i] === lower){
                  numbers.splice(i,1); break;
                }
              }
            }
          }
        }
        let calc = calculate(numbers);
        let mus = 0;
        let count = 0;
        for(const name in group){ group[name].data[0].con !== 'marriage'? count +=1 : count += 0}
        if(count == 1){
          for(const name in group){
            if(group[name].data[0].con !== 'marriage'){
              group[name] = { ...group[name], item:{...group[name].item, worth: sum, share: 'ف ر' } }
            }
          }
        } else if(count > 1){
          for(const name in group){
            const upper = group[name].item.upper;
            const lower = group[name].item.lower;
            if(group[name].data[0].con !== 'marriage') { 
              group[name] = { ...group[name], item:{...group[name].item, worth: calc * (upper / lower), share:'ف ر'} }
              mus += calc * (upper / lower); 
            }
          }
          let sus = 0;
          let mum = 0;
          if(mus % sum !== 0){
            for(let i=1; i<99; i++){
              if(mus*i%sum == 0){
                sus = i;
                break;
              }
            }
          } else { sus = mus/sum }
          if(sum % mus !== 0){
            for(let i=1; i<99; i++){
              if(sum*i%mus == 0){
                mum = i;
                break;
              }
            }
          } else { mum = sum/mus }
          // suspesiously working
          sum = sus; mus = mum;
          substitude = mus*substitude;
          for(const name in group){
            const worth = group[name].item.worth;
            group[name].data[0].con == 'marriage' ? 
              group[name] = { ...group[name], item:{...group[name].item, worth: worth*mus}}
            :
              group[name] = { ...group[name], item:{...group[name].item, worth: worth*sum, share:'ف ر'}}
          }
          setDec(substitude);
        }
      } else if(sum < calculation){
        setDec(sum);
      }
    }
    addWorth();

    function Break(){
      let breaks = [];
      let Break = 1;
      for(const name in group){
        const count = group[name].count;
        const worth = group[name].item.worth;
        if(worth%count !== 0){
          for(let i=2; i<99; i++){
            if(worth*i%count == 0){
              Break = i;
              break
            }
          }
        }
        breaks.push(Break);
      }
      setBr(calculate(breaks));
      for(const name in group){
        const worth = group[name].item.worth;
        group[name] = {...group[name], item:{...group[name].item, worth: worth * breaking}}
      }
    }
    Break();

    // replace group with group once all mutations done
    setgroup(group);
    // continue table rendering using group (not the mutated state)
    const rendergroup = group;
    // ...existing code continues but replace uses of `group` below with `rendergroup`
    //the table proccess
    
    for(const name in rendergroup){
      let substitude = (increament + decreament) === 0 ? calculation :
                 increament > calculation ? increament :
                 decreament !== 0 ? decreament : calculation;
      substitude = substitude * breaking;

      substitude = substitude || 1; // avoid zero
      const share = rendergroup[name].item.share == 'ب' ? 'الباقي' :
      rendergroup[name].item.share == 'ع' ? 'عصبة' :
      rendergroup[name].item.share == 'م' ? 'محجوب' :
      rendergroup[name].item.share == 'ف ر' ? 'بالرد' : 
      rendergroup[name].item.share == '1/3 ب' ? '1/3 الباقي' : 
      rendergroup[name].item.share == '2/3 ب' ? '2/3 الباقي' : rendergroup[name].item.share;

      const worth = rendergroup[name].item.worth;
      const count = rendergroup[name].count;

      if(share === 'عصبة' || share === 'الباقي'){
        if(rendergroup[name].force === true){
          let mcount = rendergroup[name].item.mcount;
          let fcount = rendergroup[name].item.fcount;
          let mworth = worth/count*2;
          let fworth = worth/count;
          tableSubstitude.push(
            <tr key={rendergroup[name].mdata[0].ID}>
              <td>{ Math.floor(((mworth / substitude * inheritage)) * 1000) / 1000 }</td>
              <td>{ Math.floor((mworth / substitude * 100) * 1000) / 1000 }%</td>
              <td>{ (mworth) }</td>
              <td>{rendergroup[name].mdata[0].name}</td>
              <td rowSpan={mcount+fcount}>{share}</td>
            </tr>)
          for(let i=1;i<mcount;i++){tableSubstitude.push(
            <tr key={rendergroup[name].mdata[i].ID}>
              <td>{ Math.floor(((mworth / substitude * inheritage)) * 1000) / 1000 }</td>
              <td>{ Math.floor((mworth / substitude * 100) * 1000) / 1000 }%</td>
              <td>{ (mworth) }</td>
              <td>{rendergroup[name].mdata[i].name}</td>
            </tr>
          )}
          for(let i=0;i<fcount;i++){tableSubstitude.push(
            <tr key={rendergroup[name].fdata[i].ID}>
              <td>{ Math.floor((fworth / substitude * inheritage) * 1000) / 1000 }</td>
              <td>{ Math.floor((fworth / substitude * 100) * 1000) / 1000 }%</td>
              <td>{ (fworth) }</td>
              <td>{rendergroup[name].fdata[i].name}</td>
            </tr>
          )}
        } else if(rendergroup[name].force === false){
          tableSubstitude.push(
            <tr key={rendergroup[name].data[0].ID}>
              <td>{ Math.floor(((worth / substitude * inheritage)/count) * 1000) / 1000 }</td>
              <td>{ Math.floor(((worth / substitude * 100)/ count) * 1000) / 1000 }%</td>
              <td>{ (worth/count) }</td>
              <td>{rendergroup[name].data[0].name}</td>
              <td rowSpan={count}>{share}</td>
            </tr>)
          for(let i=1;i<count;i++){tableSubstitude.push(
            <tr key={rendergroup[name].data[i].ID}>
              <td>{ Math.floor(((worth / substitude * inheritage)/count) * 1000) / 1000 }</td>
              <td>{ Math.floor(((worth / substitude * 100)/ count) * 1000) / 1000 }%</td>
              <td>{ (worth/count) }</td>
              <td>{rendergroup[name].data[i].name}</td>
            </tr>
          )}
        }
      } else {
        tableSubstitude.push(
          <tr key={rendergroup[name].data[0].ID}>
            <td>{ Math.floor(((worth / substitude * inheritage)/count) * 1000) / 1000 }</td>
            <td>{ Math.floor(((worth / substitude * 100)/ count) * 1000) / 1000 }%</td>
            <td>{ (worth/count) }</td>
            <td>{rendergroup[name].data[0]?.name}</td>
            <td rowSpan={count}>{share}</td>
          </tr>
        );
        for(let i = 1; i < (rendergroup[name].count || 1); i++){
          tableSubstitude.push(
            <tr key={rendergroup[name].data[i].ID}>
              <td>{ Math.floor(((worth / substitude * inheritage)/count) * 1000) / 1000 }</td>
              <td>{ Math.floor(((worth / substitude * 100)/ count) * 1000) / 1000 }%</td>
              <td>{ (worth/count) }</td>
              <td>{rendergroup[name].data[i]?.name}</td>
            </tr>
          );
        }
      }
    } // end for rendergroup

    setTable(tableSubstitude);

  },[breaking, calculation, decreament, group, increament, inheritage, kinship, list]);

  return (
    <div className='container'>
      <div id="items">
        <table>
          <thead style={{backgroundColor:"lightgrey"}}>
            <tr>
              <td>{ inheritage > 1000000000 ? 'تبارك الله, بيليونير' : ''}</td>
              <td>100%</td>
              <td>{ (increament + decreament) === 0 ? calculation*breaking :
                 increament > calculation ? `بالعول ${increament*breaking}` :
                 decreament !== 0 ? `بالرد ${decreament*breaking}` : calculation*breaking }</td>
              <td>الوارث</td>
              <td>الفرض</td>
            </tr>
          </thead>
          <tbody>
            {table}
          </tbody>
        </table>
      </div>
      <div id="total" style={{marginBottom:'50px'}}>
        <input name="inheritage" type="number" onKeyUp={(e) => {setInh(Number(e.target.value) || 0)}} placeholder="قيمة الميراث"/>
        <label htmlFor=""> :أدخل قيمة الميراث</label>
      </div>
    </div>
  );
}

export default Cart;