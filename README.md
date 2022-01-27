This is a crypto lottery bot for telegram.

The lottery contract runs on BSC, but it could be migrated to any EVM compatible chain.

Tickets are purchased in USDT (BEP20) at the cost of 3 USDT each and prizes are paid out in the same currency. USDT can easily be replaced by a different token, such as DAI.

The main peculiarites of the projects are:

1) Everybody needs to interact with the lottery without using metamask

2) BOT needs to be integrated in existing Telegram groups so that commissions can be paid to owners of the group where the ticket is sold.

These challenges were addressed using cronjobs extensively. 

Basically, players pay the ticket price to regular addresses which are monitored through cronjobs. Then, when payments are detected the following happens:

1) Contract owner sends 1.5 USDT to the lottery contract.

2) all the relevant data on players and resellers 

3) 0.5 commisison fee paid to reseller right away

4) owner sends to addresses the necessay amount of BNB which are needed to swipe their USDT balance. 

A second cronjob takes care of extracting the ticket price (3 USDT) from the ticket address, thereby refunding the lottery contract's owner.

The project can be further improved by adding truly random winner selection functionality by adopting chainlink VRF

