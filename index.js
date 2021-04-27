//d01c4ba184d5a597638a11bd67f5463ae0a9d3badf7d20480a11b38137101945101c882354fd8597329dc


//tank_id,all.battles,all.damage_dealt,all.wins
const { VK } = require('vk-io')
const fs = require('fs');
const base = require('./base.json')
const fetch = require('node-fetch');
const TankNames = require('./TankNames.json');

setInterval(()=>{
	fs.writeFileSync("./base.json",JSON.stringify(base,null,"\t"));
},3000)


const vk = new VK({
    token: 'd01c4ba184d5a597638a11bd67f5463ae0a9d3badf7d20480a11b38137101945101c882354fd8597329dc',
	apiMode: "parallel",
	pollingGroupId: 204009451
})

vk.updates.hear(/^моястатистика$/i,async(context)=>{
	try {

		let nicknametst = base[context.senderId].nickname
	  
	  } catch (err) {
	  
		console.log(err);
		return context.send('Задайте свой никнейм командой "никнейм ваш_никнейм"\n Пример: никнейм Tortik  ');
	  
	  }

	
	let id = base[context.senderId].id;
	let response1 = await fetch('https://api.wotblitz.ru/wotb/account/info/?application_id=fb10fec85f2b63313540af9823ddfde0&account_id='+ id);
	let data1 = await response1.json();

	
	
	//console.log(data1.data[id].statistics);

	
	
	await context.send(
		"Никнейм: " + base[context.senderId].nickname + "\n" +
	    "Всего боёв: " + data1.data[id].statistics.all.battles + "\n" +
		"Процент побед: " + ((data1.data[id].statistics.all.wins / data1.data[id].statistics.all.battles)*100).toFixed(2)  + "\n" +
		"_________" + "\n" +
		"Средний урон: " + (data1.data[id].statistics.all.damage_dealt / data1.data[id].statistics.all.battles).toFixed(2) + "\n" +
		"Выстелов за бой: " + (data1.data[id].statistics.all.shots / data1.data[id].statistics.all.battles).toFixed(2) + "\n" +
		"Вытанковано в среднем: " + (data1.data[id].statistics.all.damage_received / data1.data[id].statistics.all.battles).toFixed(2) + "\n" +
		"Средний опыт: " + (data1.data[id].statistics.all.xp / data1.data[id].statistics.all.battles).toFixed(2) + "\n"+
		"_________" + "\n" +
		"Макс. опыт за бой: " + data1.data[id].statistics.all.max_xp 
		);
})

vk.updates.hear(/^никнейм\s(.*)$/i,async(Context)=>{

	/*let user = await vk.api.users.get({
		user_ids: Context.senderId
	});

	var username = user[0].first_name + " " + user[0].last_name;
	console.log(Context);*/

	//Получение id танков по нику
	let response = await fetch('https://api.wotblitz.ru/wotb/account/list/?application_id=fb10fec85f2b63313540af9823ddfde0&search='+ Context.$match[1]);
	let data = await response.json();
	
	if(data.meta.count == 0) return Context.send('Ошибка: никнейм ' + Context.$match[1] + ' не найден');
	

	base[Context.senderId] = {
		nickname: data.data[0].nickname,
		id: data.data[0].account_id 
	}
	//return Context.send('Привет -  ' + username + " | Ваше сообщение : " + Context.$match[1]);
	return Context.send('Установлен никнейм:  ' +  data.data[0].nickname);

});


vk.updates.hear(/^статистика\s(.*)$/i,async(Context)=>{

	let data,response;
	try {
	response = await fetch('https://api.wotblitz.ru/wotb/account/list/?application_id=fb10fec85f2b63313540af9823ddfde0&search='+ Context.$match[1]);
	data = await response.json();
	} catch (err) {
	  
		console.log(err);
		return Context.send('Ошибка: никнейм ' + Context.$match[1] + ' не найден');
  
  	}

	
	if(data.meta.count == 0) return Context.send('Ошибка: никнейм ' + Context.$match[1] + ' не найден');

	let id = data.data[0].account_id;
	

	let response1 = await fetch('https://api.wotblitz.ru/wotb/account/info/?application_id=fb10fec85f2b63313540af9823ddfde0&account_id='+ id);
	let data1 = await response1.json();

	//console.log(data1.data[id].statistics);

	
	await Context.send(
		"Никнейм: " + data1.data[id].nickname + "\n" +
	    "Всего боёв: " + data1.data[id].statistics.all.battles + "\n" +
		"Процент побед: " + ((data1.data[id].statistics.all.wins / data1.data[id].statistics.all.battles)*100).toFixed(2)  + "\n" +
		"_________" + "\n" +
		"Средний урон: " + (data1.data[id].statistics.all.damage_dealt / data1.data[id].statistics.all.battles).toFixed(2) + "\n" +
		"Выстелов за бой: " + (data1.data[id].statistics.all.shots / data1.data[id].statistics.all.battles).toFixed(2) + "\n" +
		"Вытанковано в среднем: " + (data1.data[id].statistics.all.damage_received / data1.data[id].statistics.all.battles).toFixed(2) + "\n" +
		"Средний опыт: " + (data1.data[id].statistics.all.xp / data1.data[id].statistics.all.battles).toFixed(2) + "\n"+
		"_________" + "\n" +
		"Макс. опыт за бой: " + data1.data[id].statistics.all.max_xp 
		);
	

});


//Просмотр сессии
vk.updates.hear(/^сессия$/i,async(context)=>{

	if(base[context.senderId] == undefined) return context.send('Для использования сессий задайте свой никнейм командой "никнейм ваш_никнейм"\n Пример: никнейм Tortik  ');
	
	if(base[context.senderId].session == undefined) return context.send('У вас нет активной сессии.\n Начать сессию можно командой "сессияначать" ');
	
	
	let id = base[context.senderId].id;
	let response3 = await fetch('https://api.wotblitz.ru/wotb/tanks/stats/?application_id=fb10fec85f2b63313540af9823ddfde0&account_id='+ id +'&fields=tank_id%2Call.battles%2Call.wins%2Call.damage_dealt');
	let data3 = await response3.json();
	
	if(data3.status == 'error')  return context.send("Ошибка. Код: " + data3.error.code);

	//Строки вывода
	let strOutAll = 'Сессионная статистика ' + base[context.senderId].nickname +
				'\n Начата: ' + base[context.senderId].StartedAt;
	let strOutTanks = '';
	let AllSessionBatles = 0,AllSessionWins = 0,AllSessionDamage = 0;
	
	for (var key in data3.data[id]) {
		//Текущий id танка в цикле
		let NowTankID = data3.data[id][key].tank_id;
	    //console.log(NowTankID);
		if( (TankNames.data[data3.data[id][key].tank_id]!==undefined) && (base[context.senderId].session[NowTankID].startBattles != data3.data[id][key].all.battles)){

			//console.log(base[context.senderId].session[NowTankID].startBattles + '  ' + TankNames.data[NowTankID].name + ' ' + data3.data[id][key].all.battles);
			
			//Формирование строки вывода 
			AllSessionBatles = AllSessionBatles + (data3.data[id][key].all.battles - base[context.senderId].session[NowTankID].startBattles);
			AllSessionWins = AllSessionWins + (data3.data[id][key].all.wins - base[context.senderId].session[NowTankID].startWins);
			AllSessionDamage = AllSessionDamage + (data3.data[id][key].all.damage_dealt - base[context.senderId].session[NowTankID].startDamage);
			strOutTanks = strOutTanks + TankNames.data[NowTankID].name + 
			'\nБои: ' + (data3.data[id][key].all.battles - base[context.senderId].session[NowTankID].startBattles);
				if((data3.data[id][key].all.battles - base[context.senderId].session[NowTankID].startBattles)!=0) 
					strOutTanks += '|Побед: ' + (((data3.data[id][key].all.wins - base[context.senderId].session[NowTankID].startWins)/(data3.data[id][key].all.battles - base[context.senderId].session[NowTankID].startBattles))*100).toFixed(1) + '%'
					+ '|С/У: ' + ((data3.data[id][key].all.damage_dealt - base[context.senderId].session[NowTankID].startDamage)/(data3.data[id][key].all.battles - base[context.senderId].session[NowTankID].startBattles)).toFixed(0) + '\n--\n';

		}
		
	};
	let PercentWins = 0, srSessionDamage = 0;
	if (AllSessionBatles != 0 ) {
		 PercentWins = (AllSessionWins/AllSessionBatles)*100;
		 srSessionDamage = AllSessionDamage/AllSessionBatles;
	}
	strOutAll+= '\n Общая статистика:\nБои:' +  AllSessionBatles + ' Побед: ' + PercentWins.toFixed(2) + ' %' + ' Ср.Урон: ' + srSessionDamage.toFixed(0) +
	'\n___________\n' + strOutTanks;
	
	await context.send(strOutAll);
});

//начать сессию
vk.updates.hear(/^сессияначать$/i,async(context)=>{

	if(base[context.senderId] == undefined) return context.send('Для использования сессий задайте свой никнейм командой "никнейм ваш_никнейм"\n Пример: никнейм Tortik  ');

	
	Data = new Date();
	Year = Data.getFullYear();
	Month = 1 + Data.getMonth(); if(Month<10) Month = "0" + Month;
	Day = Data.getDate(); 
	Hour = Data.getHours(); if(Hour<10) Hour = "0" + Hour;
	Minutes = Data.getMinutes(); if(Minutes<10) Minutes = "0" + Minutes;
	
	//'https://api.wotblitz.ru/wotb/tanks/stats/?application_id=fb10fec85f2b63313540af9823ddfde0&account_id='+id+'&fields=tank_id%2Call.battles%2Call.wins%2Call.damage_dealt'

	let id = base[context.senderId].id;
	let response2 = await fetch('https://api.wotblitz.ru/wotb/tanks/stats/?application_id=fb10fec85f2b63313540af9823ddfde0&account_id='+ id +'&fields=tank_id%2Call.battles%2Call.wins%2Call.damage_dealt');
	let data2 = await response2.json();
	
	//console.log(data2.data);
	//base[context.senderId].session = data2.data;
	
	let Obj1 = {

	};
	for (var iter in data2.data[id]) {
		
		Obj1[data2.data[id][iter].tank_id] = {
			startBattles:data2.data[id][iter].all.battles,
			startWins: data2.data[id][iter].all.wins,
			startDamage: data2.data[id][iter].all.damage_dealt
		}

	}
	let srtStarted = Day + '.'+ Month + '.' + Year + ' ' + Hour + ':' + Minutes;
	base[context.senderId].StartedAt = srtStarted;
	base[context.senderId].session = Obj1;

	await context.send('Сессия ' + base[context.senderId].nickname + ' начата| ' + srtStarted); 
});




vk.updates.hear(/^тест$/i,async(context)=>{
	let name = TankNames.data[49].name;
	return context.send('тестовая команда  ' + name);
});

async function run(){
	await vk.updates.startPolling();
	console.log("Started");
}

run().catch(console.error);