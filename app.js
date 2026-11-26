'use strict';
const prices = {landing:35000,company:65000};
const names = {landing:'Лендинг',company:'Сайт компании'};
const form = document.querySelector('#estimate-form');
const money = n => new Intl.NumberFormat('ru-RU').format(n)+' ₽';
function calculate(){
  const data = new FormData(form), kind=data.get('package');
  const total=prices[kind]+Number(data.get('copy')||0)+Number(data.get('booking')||0);
  const support=Number(data.get('support')||0);
  document.querySelector('#total').textContent=money(total);
  document.querySelector('#recurring').textContent=support?'+ '+money(support)+'/мес. за поддержку':'Без ежемесячной поддержки';
  document.querySelector('#time').textContent=kind==='landing'?'10-14 рабочих дней':'20-25 рабочих дней';
  const extras=[data.has('copy')?'тексты':null,data.has('booking')?'подключение записи':null].filter(Boolean);
  document.querySelector('#brief-estimate').value=names[kind]+(extras.length?' + '+extras.join(' + '):'')+': '+money(total)+(support?' + '+money(support)+'/мес.':'');
}
form.addEventListener('change',calculate);
document.querySelectorAll('[data-package]').forEach(link=>link.addEventListener('click',()=>{form.elements.package.value=link.dataset.package;calculate();}));
const menu=document.querySelector('.menu-button'), nav=document.querySelector('#mobile-nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.hidden=!open;menu.textContent=open?'Закрыть':'Меню';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.textContent='Меню';}));
document.querySelector('.service-list article:last-child a').addEventListener('click',()=>{form.elements.support.checked=true;calculate();});
document.querySelector('#brief-form').addEventListener('submit',event=>{
  event.preventDefault();
  const brief=new FormData(event.currentTarget);
  const content=['Бриф на разработку сайта | студия «Точка»','Учебный проект. Файл создан локально, данные не отправлялись.','',...['name','business','task','estimate'].map((key,i)=>['Имя','Бизнес','Задача','Предварительная оценка'][i]+': '+String(brief.get(key)).trim()),'','Оценка предварительная. Домен, хостинг и тарифы внешних сервисов оплачиваются отдельно.','Подготовка текстов и подключение записи не меняют базовый диапазон сроков автоматически; срок уточняется после согласования материалов.'].join('\r\n');
  const url=URL.createObjectURL(new Blob(['\uFEFF',content],{type:'text/plain;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='tochka-brief.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
  document.querySelector('#form-status').textContent='Бриф подготовлен к скачиванию. Проверьте папку загрузок. Данные никуда не отправлялись.';
});
calculate();
