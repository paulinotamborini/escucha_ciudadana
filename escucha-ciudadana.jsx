import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";

/* ------------------------------------------------------------------
   Datos precalculados a partir de dataset_escucha_ciudadana_metabase.csv
   (142.577 registros — corte 21/08/2026)

   sources[k].byMonth[i] = [
     0 volumen total, 1 filas, 2 analizable, 3 filas analizables,
     4 con temática, 5 filas con temática,
     6 Positivo, 7 Neutro, 8 Negativo, 9 Incierto, 10 con señal de frustración
   ]
   sources[k].themeMonth = [ [mesIdx, temaIdx, volumen, clasificados, negativos, positivos] ]
   comments = [ [fuente, fecha, canal, tono, temática, texto, confianza] ]
------------------------------------------------------------------ */
const DATA = {"months":["2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07","2026-08"],"themes":["Agenda, cultura y deportes","Alumbrado público","Anegamiento y desagües","Arbolado","Barrios y territorio","Bicicletas","Calles y veredas","Costanera, río y playas","Estacionamiento y tránsito","Gestión municipal e Intendente","Habilitaciones y comercio","Imagen e identidad de Rosario","Licencia de conducir","Multas y liberación de vehículos","MuniBot y atención digital","Obras y espacio público","Personas en situación de calle","Residuos y limpieza","Ruidos molestos","Salud y bienestar animal","Seguridad","Transporte público","Tributos y TGI"],"tones":["Positivo","Neutro","Negativo","Incierto"],"sources":{"social":{"label":"Social público","isSample":false,"byMonth":[[1662,1662,1660,1660,835,835,144,387,918,211,461],[3488,3488,3479,3479,1543,1543,304,841,1907,427,824],[4386,4386,4376,4376,1694,1694,1106,984,1697,589,1144],[2446,2446,2430,2430,1019,1019,336,649,1100,345,608],[5702,5702,5688,5688,2250,2250,926,1310,2662,790,1393],[2888,2888,2877,2877,1017,1017,711,677,1123,366,734],[2975,2975,2961,2961,1278,1278,570,743,1232,416,697],[3409,3409,3386,3386,1564,1564,421,813,1718,434,792],[2786,2786,2782,2782,1344,1344,265,738,1420,359,627],[9862,9862,9820,9820,6510,6510,611,1596,5268,2345,3072],[4346,4346,4337,4337,1591,1591,1147,765,1598,827,1270],[4114,4114,4106,4106,1178,1178,1047,908,1463,688,982],[675,675,673,673,242,242,131,194,256,92,141]],"themeMonth":[[0,0,55,31,13,7],[0,1,22,22,21,0],[0,2,5,5,5,0],[0,3,24,22,17,0],[0,4,63,60,36,4],[0,5,17,13,6,2],[0,6,364,339,277,9],[0,7,4,4,2,1],[0,8,28,28,20,2],[0,9,56,50,42,0],[0,10,2,1,1,0],[0,11,22,19,3,15],[0,13,5,5,5,0],[0,14,4,4,3,0],[0,15,58,53,30,10],[0,17,21,21,17,1],[0,19,10,10,9,0],[0,20,10,9,7,0],[0,21,35,33,24,2],[0,22,30,28,27,1],[1,0,36,36,8,18],[1,1,20,19,17,0],[1,2,15,12,8,1],[1,3,52,48,38,1],[1,4,114,104,74,0],[1,5,13,9,5,0],[1,6,663,620,506,17],[1,7,26,23,10,5],[1,8,57,52,40,0],[1,9,120,105,85,5],[1,10,11,10,6,1],[1,11,36,36,7,26],[1,12,2,2,2,0],[1,13,14,14,13,0],[1,14,3,3,1,0],[1,15,108,97,67,10],[1,17,53,50,47,1],[1,18,4,4,4,0],[1,19,99,92,75,2],[1,20,26,22,20,1],[1,21,13,13,11,0],[1,22,58,54,51,0],[2,0,78,65,27,30],[2,1,20,19,15,1],[2,2,7,7,7,0],[2,3,36,34,25,5],[2,4,147,132,88,10],[2,5,16,15,7,2],[2,6,450,419,338,12],[2,7,21,18,4,6],[2,8,27,26,20,1],[2,9,165,150,90,23],[2,10,4,4,3,1],[2,11,268,259,18,225],[2,13,13,13,12,0],[2,14,9,9,4,1],[2,15,94,86,46,16],[2,17,86,83,72,2],[2,18,7,7,7,0],[2,19,30,24,16,1],[2,20,20,19,16,0],[2,21,94,88,51,6],[2,22,102,91,81,2],[3,0,25,20,7,4],[3,1,14,14,12,0],[3,2,5,4,4,0],[3,3,35,31,23,1],[3,4,107,98,59,14],[3,5,3,2,2,0],[3,6,357,338,287,9],[3,7,26,24,11,3],[3,8,15,13,10,0],[3,9,57,54,40,8],[3,10,10,8,4,1],[3,11,39,39,6,31],[3,12,2,2,1,0],[3,13,8,8,7,1],[3,14,5,5,3,0],[3,15,116,110,59,18],[3,17,59,52,45,1],[3,18,3,3,3,0],[3,19,24,24,14,2],[3,20,13,12,11,0],[3,21,52,47,31,6],[3,22,44,43,38,2],[4,0,103,100,40,16],[4,1,25,23,19,2],[4,2,9,8,7,0],[4,3,125,113,69,28],[4,4,209,198,127,16],[4,5,11,9,7,1],[4,6,514,483,383,18],[4,7,16,13,7,3],[4,8,28,28,24,1],[4,9,193,178,125,30],[4,10,9,9,6,0],[4,11,131,123,15,96],[4,12,1,1,1,0],[4,13,25,25,22,0],[4,14,5,5,4,0],[4,15,167,156,89,35],[4,16,1,1,1,0],[4,17,300,283,245,2],[4,18,42,38,33,1],[4,19,112,103,72,14],[4,20,56,53,40,2],[4,21,46,45,35,2],[4,22,122,113,97,0],[5,0,48,45,23,8],[5,1,17,16,11,2],[5,2,13,12,11,0],[5,3,28,27,18,1],[5,4,98,92,45,4],[5,5,3,3,2,0],[5,6,246,234,196,8],[5,7,20,18,6,9],[5,8,10,8,6,0],[5,9,88,79,45,17],[5,10,1,0,0,0],[5,11,41,40,1,37],[5,12,1,1,1,0],[5,13,6,4,4,0],[5,14,12,11,7,0],[5,15,76,70,41,10],[5,17,118,110,73,3],[5,18,5,5,5,0],[5,19,47,45,32,7],[5,20,16,13,9,1],[5,21,69,66,48,1],[5,22,54,53,50,2],[6,0,31,31,12,12],[6,1,18,17,15,0],[6,2,14,11,11,0],[6,3,29,25,18,2],[6,4,176,158,88,10],[6,5,8,7,4,0],[6,6,429,402,316,19],[6,7,52,48,19,13],[6,8,15,15,12,1],[6,9,79,68,44,7],[6,10,5,5,3,1],[6,11,123,117,10,104],[6,12,1,1,1,0],[6,13,16,13,12,0],[6,14,1,1,0,0],[6,15,86,74,46,18],[6,17,67,62,59,1],[6,18,4,4,4,0],[6,19,25,21,8,1],[6,20,18,14,12,1],[6,21,18,18,15,0],[6,22,63,62,51,1],[7,0,31,24,12,7],[7,1,25,25,20,1],[7,2,10,9,7,0],[7,3,89,85,64,7],[7,4,179,166,99,5],[7,5,5,4,4,0],[7,6,451,425,345,12],[7,7,30,24,13,8],[7,8,23,23,21,0],[7,9,136,120,73,22],[7,10,7,7,6,0],[7,11,57,54,10,42],[7,13,36,32,30,0],[7,14,2,2,0,0],[7,15,167,155,107,23],[7,16,1,1,1,0],[7,17,93,86,75,6],[7,18,8,6,6,0],[7,19,43,41,22,3],[7,20,40,37,28,3],[7,21,68,60,42,1],[7,22,63,57,46,3],[8,0,29,26,14,6],[8,1,18,18,15,2],[8,2,6,5,4,0],[8,3,24,22,17,1],[8,4,126,115,55,6],[8,5,19,18,14,0],[8,6,430,393,313,11],[8,7,115,103,65,11],[8,8,26,26,16,1],[8,9,103,91,66,5],[8,10,6,6,3,0],[8,11,28,26,15,7],[8,13,19,18,17,0],[8,14,7,7,4,0],[8,15,93,85,56,10],[8,17,52,44,38,3],[8,18,4,3,3,0],[8,19,121,102,60,13],[8,20,28,26,22,0],[8,21,18,17,14,1],[8,22,72,64,58,1],[9,0,87,72,47,9],[9,1,21,18,17,0],[9,2,14,14,8,2],[9,3,208,166,133,5],[9,4,126,112,83,4],[9,5,17,14,5,7],[9,6,566,524,445,8],[9,7,3828,2384,1890,80],[9,8,46,42,27,1],[9,9,385,343,261,18],[9,10,8,8,6,1],[9,11,98,92,53,27],[9,12,3,3,0,0],[9,13,10,10,10,0],[9,14,7,7,4,0],[9,15,631,523,378,41],[9,17,131,115,105,2],[9,18,2,2,2,0],[9,19,160,135,74,27],[9,20,52,47,40,3],[9,21,27,25,16,0],[9,22,83,78,71,1],[10,0,60,52,20,26],[10,1,2,2,2,0],[10,2,7,6,6,0],[10,3,50,46,34,4],[10,4,81,72,30,7],[10,5,2,2,1,0],[10,6,150,138,108,4],[10,7,589,414,326,17],[10,8,15,14,10,0],[10,9,117,110,63,25],[10,10,4,4,4,0],[10,11,191,180,24,149],[10,12,3,3,0,0],[10,13,5,4,4,0],[10,14,2,2,1,0],[10,15,172,155,103,25],[10,17,58,55,44,3],[10,18,3,3,3,0],[10,19,30,29,17,6],[10,20,26,25,24,1],[10,21,12,11,7,3],[10,22,12,12,11,0],[11,0,44,40,22,11],[11,1,9,7,7,0],[11,2,8,7,7,0],[11,3,107,94,73,6],[11,4,78,70,39,3],[11,6,184,164,121,10],[11,7,86,63,45,6],[11,8,8,8,6,0],[11,9,118,106,61,15],[11,10,7,6,1,1],[11,11,87,82,9,64],[11,12,1,1,1,0],[11,13,10,10,8,0],[11,14,9,9,4,0],[11,15,86,76,31,22],[11,17,154,141,110,7],[11,18,3,3,3,0],[11,19,65,55,38,6],[11,20,26,21,19,2],[11,21,41,39,28,3],[11,22,47,44,40,1],[12,0,56,45,21,14],[12,1,1,1,1,0],[12,2,2,2,2,0],[12,3,39,37,27,3],[12,4,15,12,11,0],[12,6,26,26,22,1],[12,7,16,15,12,0],[12,9,18,17,10,4],[12,11,12,12,1,11],[12,14,3,3,1,1],[12,15,24,19,5,4],[12,17,6,6,6,0],[12,19,18,18,11,2],[12,22,6,6,5,0]],"channels":[["Instagram - Orgánico",25979],["Facebook - Orgánico",18488],["Facebook - Anuncio",3086],["Instagram - Anuncio",1186]],"nonEligible":[["Opción o control",103],["Dato o enlace sin opinión",49],["Saludo o despedida",9],["Sin comentario",2],["Adjunto, ubicación o contacto",1]]},"encuesta":{"label":"Encuesta","isSample":false,"byMonth":[[4,4,4,4,4,4,1,2,1,0,0],[8561,8561,6707,6707,5900,5900,1241,1955,2202,1309,393],[7970,7970,6591,6591,5826,5826,1195,1926,2176,1294,341],[6574,6574,5340,5340,4871,4871,980,1525,1851,984,343],[6473,6473,5298,5298,4861,4861,868,1509,1973,948,351],[6181,6181,4948,4948,4484,4484,840,1468,1743,897,361],[5425,5425,4389,4389,4006,4006,793,1197,1571,828,254],[6621,6621,5405,5405,4951,4951,882,1566,1976,981,337],[5227,5227,4240,4240,3877,3877,687,1277,1526,750,253],[4275,4275,3463,3463,3191,3191,611,1018,1243,591,185],[3696,3696,2863,2863,2642,2642,443,829,1042,549,187],[4189,4189,3349,3349,3101,3101,548,1020,1196,585,191],[1889,1889,1543,1543,1420,1420,278,472,534,259,87]],"themeMonth":[[0,0,1,1,0,1],[0,6,2,2,0,0],[0,19,1,1,1,0],[1,0,76,66,19,22],[1,1,911,796,243,237],[1,2,57,52,27,8],[1,3,470,410,182,84],[1,4,42,39,25,4],[1,5,19,14,5,4],[1,6,911,805,354,154],[1,7,2,2,1,0],[1,8,348,295,132,58],[1,9,43,40,20,13],[1,10,16,15,11,0],[1,11,2,1,0,1],[1,12,431,376,134,99],[1,13,456,400,120,119],[1,14,593,518,214,135],[1,15,26,23,13,2],[1,17,623,540,227,125],[1,18,616,541,306,72],[1,19,56,48,23,15],[1,20,21,17,14,2],[1,21,46,42,19,3],[1,22,135,111,50,34],[2,0,64,52,12,12],[2,1,878,752,253,228],[2,2,39,30,10,5],[2,3,465,409,155,92],[2,4,30,26,14,3],[2,5,18,15,9,2],[2,6,619,549,240,103],[2,7,3,3,2,0],[2,8,346,287,141,47],[2,9,57,54,22,1],[2,10,33,33,21,1],[2,11,4,3,0,1],[2,12,388,341,135,121],[2,13,380,331,123,95],[2,14,772,663,276,173],[2,15,25,24,14,0],[2,17,677,583,224,147],[2,18,692,616,340,65],[2,19,64,55,18,12],[2,20,18,17,12,2],[2,21,48,42,24,2],[2,22,206,181,81,46],[3,0,70,61,21,15],[3,1,918,817,339,235],[3,2,29,26,11,3],[3,3,403,361,155,62],[3,4,28,26,16,2],[3,5,13,11,4,2],[3,6,506,434,206,77],[3,7,4,4,1,1],[3,8,261,215,96,40],[3,9,28,28,22,4],[3,10,12,9,8,0],[3,12,203,187,76,54],[3,13,239,197,74,34],[3,14,463,405,172,112],[3,15,18,17,11,1],[3,17,542,472,208,101],[3,18,480,420,211,65],[3,19,39,34,10,10],[3,20,22,18,13,2],[3,21,486,403,112,132],[3,22,107,95,53,12],[4,0,125,105,27,40],[4,1,833,731,300,178],[4,2,30,25,9,8],[4,3,300,255,109,53],[4,4,26,26,17,2],[4,5,6,6,5,0],[4,6,509,429,223,83],[4,7,2,2,0,0],[4,8,260,225,113,33],[4,9,32,27,15,4],[4,10,14,14,9,0],[4,11,1,0,0,0],[4,12,263,228,95,60],[4,13,246,209,89,37],[4,14,428,384,193,78],[4,15,22,20,13,0],[4,17,876,764,331,148],[4,18,550,484,255,62],[4,19,55,52,20,16],[4,20,14,13,8,1],[4,21,82,72,38,9],[4,22,187,164,85,28],[5,0,113,95,29,24],[5,1,554,471,177,136],[5,2,17,14,7,2],[5,3,324,293,120,55],[5,4,27,26,13,2],[5,5,15,14,7,3],[5,6,543,485,210,73],[5,8,208,174,81,38],[5,9,30,29,18,4],[5,10,11,11,4,0],[5,12,325,284,125,76],[5,13,266,229,91,51],[5,14,403,357,179,80],[5,15,20,20,13,0],[5,17,733,659,282,137],[5,18,396,353,188,35],[5,19,57,52,25,7],[5,20,21,19,14,1],[5,21,86,68,26,14],[5,22,335,298,115,71],[6,0,86,73,22,29],[6,1,645,546,234,161],[6,2,13,12,1,3],[6,3,366,326,120,84],[6,4,23,21,17,0],[6,5,8,8,3,1],[6,6,403,351,163,61],[6,7,3,3,2,0],[6,8,187,157,84,26],[6,9,22,21,17,1],[6,10,14,14,10,0],[6,11,1,0,0,0],[6,12,299,270,117,56],[6,13,193,170,67,31],[6,14,372,329,151,98],[6,15,10,8,4,1],[6,17,568,504,225,112],[6,18,372,320,148,43],[6,19,34,34,8,14],[6,20,16,16,8,2],[6,21,98,83,49,15],[6,22,273,235,106,47],[7,0,76,62,20,20],[7,1,950,817,301,244],[7,2,43,41,19,10],[7,3,469,414,175,73],[7,4,32,29,17,2],[7,5,8,8,5,0],[7,6,631,544,264,98],[7,7,1,1,1,0],[7,8,248,223,112,30],[7,9,30,27,18,3],[7,10,7,6,4,0],[7,11,2,2,1,0],[7,12,215,186,75,33],[7,13,240,207,85,35],[7,14,480,431,226,99],[7,15,26,25,16,0],[7,17,693,612,274,125],[7,18,479,425,191,65],[7,19,41,38,18,6],[7,20,23,20,17,0],[7,21,108,99,56,13],[7,22,149,137,70,24],[8,0,61,50,21,10],[8,1,572,500,194,131],[8,2,46,41,20,9],[8,3,324,289,125,56],[8,4,30,27,14,0],[8,5,6,5,4,1],[8,6,570,504,195,117],[8,7,2,1,0,0],[8,8,280,246,110,33],[8,9,24,22,14,4],[8,10,7,6,4,0],[8,11,2,2,1,1],[8,12,167,152,63,35],[8,13,173,143,59,21],[8,14,371,335,175,76],[8,15,25,23,15,2],[8,17,539,485,203,88],[8,18,417,369,185,52],[8,19,39,33,13,7],[8,20,17,17,11,0],[8,21,83,74,35,14],[8,22,122,112,61,17],[9,0,41,34,12,7],[9,1,408,365,134,105],[9,2,10,10,6,3],[9,3,303,275,113,63],[9,4,22,19,10,1],[9,5,5,3,3,0],[9,6,471,400,178,78],[9,7,2,1,1,0],[9,8,240,219,100,36],[9,9,18,18,8,3],[9,10,32,31,12,2],[9,11,3,2,0,1],[9,12,112,97,44,21],[9,13,192,169,63,40],[9,14,320,273,136,53],[9,15,12,12,9,1],[9,17,505,448,186,103],[9,18,302,285,135,49],[9,19,43,40,10,17],[9,20,15,15,9,1],[9,21,59,53,35,4],[9,22,76,71,35,18],[10,0,33,28,7,9],[10,1,321,269,95,73],[10,2,14,12,4,2],[10,3,181,157,76,31],[10,4,15,12,9,1],[10,5,8,7,2,3],[10,6,431,380,179,65],[10,8,199,164,67,22],[10,9,13,11,6,2],[10,10,32,28,9,5],[10,12,116,106,52,26],[10,13,175,151,53,29],[10,14,268,239,121,44],[10,15,13,10,7,2],[10,17,365,312,145,65],[10,18,284,251,137,27],[10,19,31,26,12,5],[10,20,11,11,6,1],[10,21,49,41,19,9],[10,22,83,73,33,19],[11,0,71,59,20,20],[11,1,330,281,97,83],[11,2,43,37,21,6],[11,3,216,189,86,38],[11,4,18,16,6,1],[11,5,3,3,2,0],[11,6,465,410,181,73],[11,7,2,1,0,0],[11,8,179,151,83,18],[11,9,11,11,8,0],[11,10,54,51,12,8],[11,11,1,1,0,1],[11,12,132,106,48,21],[11,13,250,210,58,61],[11,14,395,347,161,80],[11,15,11,10,5,1],[11,17,361,326,149,68],[11,18,322,295,160,22],[11,19,76,68,25,19],[11,20,12,12,8,1],[11,21,65,57,24,8],[11,22,84,75,35,17],[12,0,3,2,1,0],[12,1,240,200,69,60],[12,2,19,18,8,6],[12,3,107,99,46,18],[12,4,3,1,0,0],[12,5,4,4,3,0],[12,6,142,128,70,24],[12,8,83,72,31,10],[12,9,3,3,2,1],[12,10,20,19,7,1],[12,12,45,40,13,11],[12,13,115,109,24,27],[12,14,263,235,94,70],[12,15,9,7,3,0],[12,17,139,116,48,17],[12,18,145,135,81,15],[12,19,20,20,7,7],[12,20,3,3,2,0],[12,21,8,8,5,0],[12,22,49,42,15,8]],"channels":[["Valoración BOT - 5 items escrita",67013],["Habilitaciones fisc ambiental",61],["Consultas Firma digital",11]],"nonEligible":[["Opción o control",5114],["Saludo o despedida",4878],["Vacío, emoji o puntuación",1882],["Sin comentario",659],["Adjunto, ubicación o contacto",334],["Dato o enlace sin opinión",78]]},"privada":{"label":"Conversación privada","isSample":true,"byMonth":[[82592,1814,39955,1020,34508,824,1571,29001,5738,3645,1214],[132422,2090,64768,1450,57703,1294,1625,42942,12356,7845,1453],[137480,2121,67858,1468,57790,1279,1571,44198,12970,9118,1233],[139456,2032,76187,1428,69462,1300,1140,55194,12130,7721,1896],[127974,2154,62582,1519,55465,1323,1081,41136,13277,7087,2328],[140373,2134,67524,1487,59331,1312,1026,46269,11624,8604,1534],[122827,2154,63820,1527,57741,1361,1422,43297,12422,6679,1100],[148125,2286,73538,1640,66456,1410,2564,47067,15264,8643,1482],[125079,2483,62775,1845,57529,1380,1036,40827,13591,7322,1802],[127431,2120,62515,1489,55059,1301,2057,43855,9141,7463,1426],[127344,1920,60611,1285,53422,1120,1340,43272,8066,7932,486],[141543,1979,74786,1375,67518,1225,1170,53504,12305,7808,1908],[58419,1466,35526,1012,32974,909,367,22776,7301,5082,382]],"themeMonth":[[0,0,513,430,1,2],[0,1,2707,2707,985,0],[0,2,3,3,3,0],[0,3,1616,1531,436,1],[0,4,175,92,84,0],[0,6,5786,5457,1265,0],[0,7,1,1,0,0],[0,8,1151,1069,4,0],[0,9,14,13,2,2],[0,10,168,167,82,0],[0,11,1,1,0,1],[0,12,988,907,3,0],[0,13,11550,10320,743,1063],[0,14,2633,2298,434,330],[0,15,270,267,6,2],[0,17,2727,2643,586,0],[0,18,2867,2538,574,82],[0,19,337,253,1,0],[0,20,3,2,2,0],[0,21,95,95,92,0],[0,22,905,823,331,82],[1,0,482,474,137,5],[1,1,4735,4471,1452,0],[1,2,138,138,136,0],[1,3,3099,3093,822,3],[1,4,22,22,5,1],[1,6,8680,8145,3087,5],[1,7,4,4,1,0],[1,8,1589,1458,529,0],[1,9,137,136,3,1],[1,10,135,135,0,0],[1,11,3,3,1,1],[1,12,1978,1978,131,132],[1,13,20212,17458,1188,1050],[1,14,5336,4516,1111,156],[1,15,412,410,270,1],[1,17,4242,3844,1725,1],[1,18,3694,3168,665,0],[1,19,676,542,266,0],[1,20,8,6,3,0],[1,21,930,536,266,0],[1,22,1192,1192,275,262],[2,0,1196,1187,148,143],[2,1,5066,4792,2333,0],[2,2,140,140,1,0],[2,3,3143,3007,281,0],[2,4,438,162,11,0],[2,5,276,276,275,0],[2,6,5562,5008,2770,0],[2,7,140,138,1,0],[2,8,1652,1649,4,0],[2,9,157,155,141,0],[2,10,11,11,5,0],[2,11,12,12,0,9],[2,12,838,701,136,137],[2,13,20358,17901,1650,817],[2,14,4869,4010,899,176],[2,15,159,158,12,2],[2,17,3474,3196,1254,0],[2,18,6138,5729,2044,0],[2,19,292,291,10,0],[2,20,418,281,139,0],[2,21,999,997,152,1],[2,22,2455,2454,683,136],[3,0,1582,1576,283,5],[3,1,7246,6961,2502,1],[3,2,281,280,139,0],[3,3,3356,2936,981,0],[3,4,568,567,281,0],[3,5,138,138,0,0],[3,6,7290,6451,2398,0],[3,7,5,4,0,0],[3,8,3605,3466,417,138],[3,9,14,13,5,0],[3,10,141,141,1,0],[3,11,2,2,0,1],[3,12,1122,1121,1,2],[3,13,18441,16916,1812,692],[3,14,3957,3526,312,11],[3,15,292,290,6,1],[3,17,3272,2985,448,0],[3,18,5277,4585,1394,0],[3,19,989,850,286,1],[3,20,141,3,2,1],[3,21,10207,9368,569,280],[3,22,1535,1258,147,0],[4,0,1407,1141,24,7],[4,1,5982,5474,1912,0],[4,2,139,139,132,1],[4,3,2973,2716,652,0],[4,4,412,406,10,2],[4,5,130,130,0,0],[4,6,5344,5084,2093,2],[4,7,9,9,1,0],[4,8,2669,2414,256,0],[4,9,26,25,10,5],[4,10,12,12,2,0],[4,11,3,3,0,1],[4,12,1158,1156,132,128],[4,13,15240,13463,2293,635],[4,14,4788,3997,1196,150],[4,15,289,285,16,3],[4,17,7179,7176,2444,0],[4,18,4589,4208,1281,0],[4,19,417,417,17,0],[4,20,258,258,257,0],[4,21,777,521,261,0],[4,22,1665,1537,260,0],[5,0,2931,2634,573,3],[5,1,3645,3088,706,139],[5,2,417,417,139,0],[5,3,2397,2395,702,2],[5,4,439,439,150,1],[5,5,422,422,141,0],[5,6,5308,4881,1753,2],[5,7,432,429,4,0],[5,8,1535,1257,141,0],[5,9,431,431,4,0],[5,10,4,4,0,0],[5,11,3,3,0,2],[5,12,2381,2103,281,1],[5,13,16987,15454,1960,556],[5,14,5896,5455,1331,19],[5,15,455,453,153,2],[5,17,7042,7036,2403,0],[5,18,2648,2509,697,1],[5,19,589,447,12,1],[5,20,285,7,5,0],[5,21,589,585,12,1],[5,22,4496,4214,432,280],[6,0,2073,2062,256,18],[6,1,4879,4636,1951,122],[6,2,621,621,123,0],[6,3,2821,2575,741,0],[6,4,270,270,8,1],[6,5,123,123,123,0],[6,6,5116,4742,1395,2],[6,7,244,244,0,0],[6,8,2075,1831,2,0],[6,9,135,134,124,5],[6,10,3,3,2,0],[6,11,7,7,0,5],[6,12,1488,1366,127,0],[6,13,16684,15342,1953,608],[6,14,6796,6161,1275,400],[6,15,638,516,259,0],[6,17,5392,5148,1846,122],[6,18,3541,3297,1098,0],[6,19,384,262,6,1],[6,20,374,374,130,0],[6,21,390,386,250,0],[6,22,3685,3196,742,1],[7,0,1435,1277,11,450],[7,1,7082,6642,2373,0],[7,2,451,305,154,1],[7,3,3703,3261,1336,148],[7,4,347,199,14,1],[7,5,5,5,4,0],[7,6,8673,7931,3587,2],[7,7,300,300,4,1],[7,8,3095,3093,594,146],[7,9,186,185,160,2],[7,10,152,151,0,0],[7,11,5,5,1,3],[7,12,2812,2516,445,0],[7,13,18944,16598,1938,879],[7,14,3921,3444,673,460],[7,15,936,935,319,0],[7,17,4907,4463,1346,2],[7,18,3840,3686,887,146],[7,19,610,609,304,0],[7,20,10,9,9,0],[7,21,1058,1058,311,1],[7,22,3984,3688,751,146],[8,0,1046,670,131,126],[8,1,6443,5578,2107,124],[8,2,622,622,4,0],[8,3,3002,2877,1128,1],[8,4,409,408,134,0],[8,5,4,4,3,0],[8,6,7074,6694,2787,1],[8,7,3,3,2,0],[8,8,3106,2858,253,1],[8,9,216,214,76,6],[8,10,250,249,126,0],[8,11,1,1,0,0],[8,12,3126,2999,505,1],[8,13,14609,12753,1616,372],[8,14,4091,3817,667,131],[8,15,405,276,137,0],[8,17,4482,4110,1494,0],[8,18,4338,4212,1611,125],[8,19,424,295,14,3],[8,20,135,134,6,1],[8,21,885,761,248,2],[8,22,2858,2363,259,124],[9,0,1449,1061,4,134],[9,1,4443,4062,1145,0],[9,2,530,529,139,0],[9,3,2324,2321,271,1],[9,4,277,274,130,0],[9,5,17,15,4,0],[9,6,6820,6433,1956,127],[9,7,195,35,17,0],[9,8,1904,1651,255,0],[9,9,11,10,0,1],[9,10,892,765,254,0],[9,11,7,6,3,0],[9,12,1924,1924,132,1],[9,13,18855,16827,1527,884],[9,14,3757,3354,680,391],[9,15,542,538,390,2],[9,16,126,126,126,0],[9,17,3335,3333,779,128],[9,18,3418,3038,887,0],[9,19,284,282,15,0],[9,20,4,4,2,0],[9,21,772,645,5,126],[9,22,3173,2415,390,126],[10,0,1079,1073,2,137],[10,1,3307,2545,641,0],[10,2,506,506,379,0],[10,3,1431,1175,140,2],[10,4,390,389,1,0],[10,5,1,1,1,0],[10,6,5547,4782,1066,2],[10,7,5,3,1,0],[10,8,3168,3168,634,126],[10,9,279,278,14,1],[10,10,1400,1400,0,1],[10,11,138,137,2,6],[10,12,2290,2163,130,1],[10,13,18465,16312,2025,632],[10,14,4658,4257,679,149],[10,15,274,147,8,4],[10,17,3334,2827,902,1],[10,18,3802,3293,1141,126],[10,19,789,786,10,1],[10,20,263,262,4,1],[10,21,776,647,3,0],[10,22,1522,1396,257,0],[11,0,3683,3119,0,144],[11,1,3809,3527,1128,0],[11,2,297,297,292,0],[11,3,1990,1989,430,0],[11,4,305,305,7,0],[11,5,141,141,0,0],[11,6,5437,5013,2158,2],[11,7,282,282,1,0],[11,8,2257,1976,144,1],[11,9,588,587,147,2],[11,10,1853,1853,144,3],[11,11,151,151,1,6],[11,12,3530,3527,284,0],[11,13,22698,20584,2408,703],[11,14,7287,6709,1307,14],[11,15,596,596,295,3],[11,17,3834,3130,1000,0],[11,18,3795,3655,1406,141],[11,19,1847,1707,284,0],[11,20,285,285,283,0],[11,21,1156,734,285,0],[11,22,1696,1555,288,141],[12,0,68,66,0,0],[12,1,3430,2965,1393,0],[12,2,302,301,4,0],[12,3,1130,895,303,1],[12,4,358,300,61,2],[12,5,116,116,0,0],[12,6,2489,2371,1133,1],[12,7,58,58,0,0],[12,8,1981,1807,700,58],[12,9,65,65,0,0],[12,10,351,293,58,0],[12,12,1978,1805,291,1],[12,13,8897,7680,583,117],[12,14,5093,4617,772,182],[12,15,124,123,63,0],[12,17,1411,1004,354,0],[12,18,2318,1854,1159,0],[12,19,826,826,61,0],[12,20,120,61,59,0],[12,21,582,466,292,0],[12,22,1277,1045,2,0]],"channels":[["incoming_whatsapp",1596091],["instagram_private",12874],["facebook_private",2100]],"nonEligible":[["Saludo o despedida",350895],["Adjunto, ubicación o contacto",324669],["Opción o control",93399],["Cortesía operativa",22172],["Dato o enlace sin opinión",6869],["Sin comentario",617],["Vacío, emoji o puntuación",1]]}},"comments":[["social","2026-02-28","Instagram - Orgánico","Positivo","No identificada","Que linda que sos Rosario 💘💘",0.95],["social","2026-01-01","Facebook - Orgánico","Positivo","No identificada","Que derroche de alegría cómo siempre en Rosario, el gran cementerio, a cierto para algunos ciudad turística.",0.94],["social","2026-06-26","Instagram - Orgánico","Positivo","No identificada","Feliz cumpleaños al mejor jugador del mundo !⚽️🇦🇷",0.9],["social","2026-01-02","Instagram - Orgánico","Positivo","No identificada","Mis chiquitas ❤️ aguante el Cc Bella Vista!!!",0.8],["social","2026-06-20","Instagram - Orgánico","Positivo","Imagen e identidad de Rosario","Todo MARAVILLOSO. Emoción pura. Felicitaciones a los organizadores. Orgullosa de ser rosarina. 🇦🇷",0.98],["social","2026-03-11","Instagram - Orgánico","Positivo","No identificada","Naaa, esto se llama: MAGIA!!!!!! Maravilloso!!!!! Más espacios para los buenos!!!👏👏👏 nos lo mereciamos",0.97],["social","2025-09-16","Facebook - Orgánico","Positivo","No identificada","Qe linda ta' está chinita ,❤️,beso,en tu osiqito,!mamasita sabionda!😁",0.9],["social","2026-06-20","Instagram - Orgánico","Positivo","No identificada","🇦🇷🇦🇷🇦🇷🇦🇷Rosario es lo más!!!🤍🩵",0.84],["social","2025-11-20","Instagram - Orgánico","Positivo","No identificada","Que lindo,los Rosarionos volvimos a ocupar los espacios públicos más lindos y renovados!!!!!!👏👏👏👏👏 esta pujante Rosario!!!!!!",0.97],["social","2025-10-07","Facebook - Orgánico","Positivo","Imagen e identidad de Rosario","Y tiene Rosarinos que la ama",0.78],["social","2026-05-27","Instagram - Orgánico","Positivo","No identificada","Imponent, majestuoso y ahora más hermoso que nunca!! Mí lugar favorito en mí Bella Rosario!! Gracias darnos lo que nos merecemos los Rosarios!! 🇦🇷✨😍🫶🏻",0.97],["social","2026-06-20","Facebook - Orgánico","Positivo","No identificada","Lo más lindo que halla sido abel Pintos quien lo canto.despues nada mas",0.86],["social","2026-05-19","Facebook - Orgánico","Positivo","Costanera, río y playas","Por fin llego el turno de mirar la florida y embellecer es para todos! Siiiiii al parque, si a la playa, si a las bajadas. Excellente proyecto!!! Y esto no quita el arreglo de otras cosas u otros proyectos, sino que forma parte de todo",0.96],["social","2026-06-06","Facebook - Orgánico","Positivo","Imagen e identidad de Rosario","ROSARINA DESDE COCHABAMBA BOLIVIA LOS AMO VIVA MESSI ALELUYA BENDICIONES AMEN AMEN",0.85],["social","2026-06-21","Facebook - Orgánico","Positivo","No identificada","Excelente divino todo felicitaciones ,",0.98],["social","2025-09-21","Instagram - Orgánico","Positivo","No identificada","El camion también es patrimonio histórico",0.68],["social","2026-07-12","Instagram - Orgánico","Positivo","No identificada","Maravilloso!!! VAMOS ARGENTINA 💙 🤍 💙...LOS AMOOOOOO 💪🇦🇷🇦🇷🇦🇷✨️☀️💖🌈🙌",0.91],["social","2026-04-27","Facebook - Orgánico","Positivo","No identificada","Adriana Casero que lindoooooo",0.82],["social","2025-10-08","Instagram - Orgánico","Positivo","No identificada","Un espectáculo maravilloso, tuve el privilegio de poder disfrutarlo!",0.97],["social","2025-09-18","Facebook - Orgánico","Positivo","No identificada","Que bueno que no los desaparezcan como tantos otros que han sacado",0.65],["social","2025-08-31","Facebook - Orgánico","Positivo","Estacionamiento y tránsito","Que bueno era hora que achique el cantero así hay más fluidez en el tránsito. Excelente 👌",0.89],["social","2026-07-02","Facebook - Orgánico","Positivo","No identificada","LINDÍSIMO Mural!! GRÁCIAS Creadores y Hacedores!!!!",0.98],["social","2026-02-28","Instagram - Orgánico","Positivo","No identificada","La más linda del mundo ...Mi Rosario ❤️",0.95],["social","2025-11-30","Instagram - Orgánico","Positivo","No identificada","Que grande el profe Gonza!!!",0.96],["social","2025-10-09","Instagram - Orgánico","Positivo","No identificada","Maravilloso!👏🏻👏🏻👏🏻👏🏻👏🏻 La ciudad que me vio nacer como cantante en el Canal 5 y donde obtuve mi título de Maestra en la Normal Nicolás Avellaneda! Felicidades querida ciudad de Rosario!!!❤️",0.94],["social","2026-02-24","Instagram - Orgánico","Positivo","No identificada","¡Qué belleza! Cómo no extrañar(la)",0.9],["social","2026-03-11","Facebook - Orgánico","Positivo","No identificada","Que lindooooooo ahí estaré!!!;❤️",0.92],["social","2025-10-25","Instagram - Orgánico","Positivo","No identificada","Disfrutá de tu ciudad...que es hermosa❤️...yo tampoco vivo en el centro...y andá a cualquier parte del mundo y es así",0.77],["social","2026-05-08","Instagram - Orgánico","Positivo","Obras y espacio público","Ese parque seguro lo disfrutaran los que puedan pagar la entrada, hubiera sido mejor usar ese dinero en arreglar la costa tan linda que tenemos, y que necesita remodelación y mantenimiento",0.72],["social","2026-07-12","Facebook - Orgánico","Positivo","Imagen e identidad de Rosario","Que felicidad!! Que lindo es ser argentina y rosarina",0.96],["social","2026-03-17","Facebook - Orgánico","Neutro","Calles y veredas","guarden unos pesitos y pongan los nombres en las calles !!!!",0.82],["social","2025-11-30","Instagram - Orgánico","Neutro","No identificada","Los papás también se pueden anotar",0.85],["social","2026-05-14","Instagram - Orgánico","Neutro","Gestión municipal e Intendente","Quién dijo que será público??? El intendente NO!!!",0.69],["social","2025-12-06","Instagram - Orgánico","Neutro","No identificada","Si aceptamos efectivo, crédito y qr.No aceptamos transferencia",0.73],["social","2025-09-11","Facebook - Orgánico","Neutro","No identificada","Cuantas veces le pusieron curitas!!!",0.58],["social","2025-10-07","Instagram - Orgánico","Neutro","No identificada","@batalla1889 es un verso los 300 años",0.72],["social","2025-09-19","Facebook - Orgánico","Neutro","No identificada","DE OV. LAGOS AL OESTE , PERTENECE A CHILE PARECE.",0.7],["social","2026-01-06","Facebook - Orgánico","Neutro","No identificada","Jose Javier Bosque argentinos. Si.",0.61],["social","2026-07-12","Facebook - Orgánico","Neutro","No identificada","Sergio Oscar Fiordani y si se la dieran la agarrarían tienen denesidad ede trabajo el 70 por ciento .",0.75],["social","2026-02-24","Instagram - Orgánico","Neutro","No identificada","Si pasa a horario el 120 me acerco ....",0.79],["social","2026-01-08","Facebook - Orgánico","Neutro","No identificada","Bana cejir areglando tablada bana areglar eñ pasillos centeno y ayacucho dio kieras",0.88],["social","2026-07-17","Instagram - Orgánico","Neutro","Habilitaciones y comercio","Van a habilitar también adentro?",0.79],["social","2025-11-17","Facebook - Orgánico","Neutro","No identificada","Isabela Acosta casi, cuesta $ 500.- la entrada.",0.58],["social","2026-05-14","Instagram - Orgánico","Neutro","Costanera, río y playas","@fausto.ff si queremos toboganes de colores frente al río!! Aguante el parque acuático",0.62],["social","2026-05-14","Instagram - Orgánico","Neutro","No identificada","Va a ser gratis para todos? NO. Entonces vaya tranquilo cualquier cosa le avisamos.",0.77],["social","2025-12-03","Facebook - Orgánico","Neutro","Seguridad","Teodoro Rodriguez cual policia local? Javkin aclaro que no.",0.85],["social","2025-11-08","Instagram - Orgánico","Neutro","Habilitaciones y comercio","Jajajaj los invitamos a venir a la florida, pero ni a palo les habilito 2 bondis, fijense como llegar atte Javkin",0.65],["social","2026-06-19","Instagram - Anuncio","Neutro","No identificada","Donde están esos puentes ???",0.71],["social","2025-11-03","Instagram - Orgánico","Neutro","No identificada","@m[NÚMERO]Buenas! Te enviamos más información por privado",0.79],["social","2026-03-23","Facebook - Orgánico","Neutro","No identificada","Quiero un perrito chiquito tráemelo mandarnr unas fotos los perritos que tienen contesta",0.85],["social","2025-10-18","Facebook - Orgánico","Neutro","Calles y veredas","Hola sr intendente. En el barrio firsheton industrial se necesita la pavimentación definitiva , con cordón. FIRSHETON INDUSTRIAL TAMBIÉN EXISTE.",0.83],["social","2026-03-20","Facebook - Anuncio","Neutro","No identificada","@faltamucho salí a recorrer",0.71],["social","2025-09-15","Facebook - Orgánico","Neutro","No identificada","Zunilda Vassalli sí , capta los nidos y come los huevos.",0.78],["social","2026-05-14","Instagram - Orgánico","Neutro","No identificada","@lucreciaalfons ????? Ah ok ok",0.75],["social","2026-03-02","Instagram - Orgánico","Neutro","No identificada","Eso va a calentar el piso al amanecer lo quiero ver en enero del año que viene",0.64],["social","2026-08-01","Instagram - Orgánico","Neutro","Arbolado","Ahora cuidan los árboles ?",0.64],["social","2026-01-02","Instagram - Orgánico","Neutro","No identificada","Quiero adoptar una cachorrita tamaño chica!!!!",0.76],["social","2025-09-30","Instagram - Anuncio","Neutro","No identificada","Efectivamente, es el mes en el que no hay que hacerse la ραjα",0.78],["social","2025-08-23","Facebook - Orgánico","Neutro","No identificada","Sergio R. Pizzirusso esos bondis nunca los vi, no sabía existía el 129 ja",0.57],["social","2026-01-24","Facebook - Anuncio","Neutro","No identificada","Son los que BS AS ya los dejo usar por lo incómodo y acá dicen 0K JAJAJA JAJAJAJA JAJAJAJA JAJAJAJA JAJAJAJA JAJAJAJA JAJAJAJA JAJAJAJA JAJAJAJA JAJAJAJA JAJAJAJA",0.73],["social","2026-06-21","Facebook - Orgánico","Negativo","Imagen e identidad de Rosario","Marta Fernandez . Antes en el monumento a la bandera no hacían nada! 😃",0.83],["social","2026-07-02","Instagram - Orgánico","Negativo","No identificada","@maxieliborda pago el sueldo de los ñoquis que nos gobiernan te parece poco?.",0.91],["social","2026-05-14","Instagram - Orgánico","Negativo","Costanera, río y playas","No queremos el parque acuático, señores",0.85],["social","2026-07-12","Facebook - Orgánico","Negativo","Salud y bienestar animal","Brenda Perrone hay pobrecita. 😂😂 Tengo marido y una bella familia mi amor. Y una vida hermosa diferente a tuya notablemente. Me das pena 😁",0.97],["social","2026-05-18","Instagram - Orgánico","Negativo","No identificada","Mira vos acá parece que no hacen nada pero donde vivo cuando han llamado vinieron pero esta en ellos si quieren ir o no salvo que tengan problemas legales. Sigan con la crítica.",0.64],["social","2026-04-17","Facebook - Anuncio","Negativo","Tributos y TGI","Pablito los barrios existen y baja los impuestos y basta de ñoquis municipales que andan boludiando por la ciudad que trabajen",0.83],["social","2025-12-14","Facebook - Orgánico","Negativo","No identificada","..¡¡..** dará todoo asco..( lo veran **)",0.93],["social","2026-05-20","Facebook - Orgánico","Negativo","Residuos y limpieza","Y la basuras de los barrios ,?",0.76],["social","2026-04-17","Instagram - Orgánico","Negativo","No identificada","Ya vemos con que plata se pagan los implantes de pelo. IMPRESENTABLES",0.82],["social","2025-11-22","Instagram - Orgánico","Negativo","No identificada","Todo agotado . El finde semana que viene continúa, verdad?",0.92],["social","2026-01-02","Instagram - Orgánico","Negativo","Salud y bienestar animal","NO A LA PIROTECNIA, YA BASTA MURIERON 14 MASCOTAS PARA QUE UNOS DESADAPTADOS DESTROZARAN LA VIDA DE LOS QUE SI APORTAN COSAS POSITIVAS A NUESTRA SOCIEDAD...TODO MAL",0.99],["social","2026-03-08","Facebook - Orgánico","Negativo","Calles y veredas","Pablito anda a vdr los barrioslas veredas un desastre el centro de la ciudad igual en la plaza Sarmiento un desastre baldosas flojas en la cual me cai ROSARIO NO ES SOLO LA COSTANERA VICITA LOS VARRIOSX FABOR",0.96],["social","2026-05-10","Instagram - Orgánico","Negativo","No identificada","@giulimar.st me duele de leer la forma que escribis somos TODOS no todos y todas , que pena vos, que si fuiste al colegio no hayas aprendido nada",0.99],["social","2026-01-13","Facebook - Anuncio","Negativo","Tributos y TGI","Barrio San Martin A por favor prometieron pavimento con cordón no parches es una falta total muy abandonado y pagamos los impuestos como todos gracias",0.92],["social","2026-05-20","Facebook - Orgánico","Negativo","Obras y espacio público","Esta jente ...siempre vienen a joder ala perxonas laburadora k se gana el pan dia a dia aciendo esta obra de mierda",0.98],["social","2025-08-14","Instagram - Orgánico","Negativo","Calles y veredas","Hubieran agrandado la calle .. terrible plazoleta...y ahora con \"los famosos juegos de chapa pintada\" de pablin? Un peligro!",0.95],["social","2026-01-15","Facebook - Anuncio","Negativo","Barrios y territorio","Y todos mal. Hechos vengan y vean , las terminaciones todas mal. Yo soy del barrio la guardia",0.83],["social","2026-05-06","Instagram - Orgánico","Negativo","Obras y espacio público","Lee los comentarios @pablojavkin. Nadie quiere un parque que abrirá cuatro meses al año. Reacondicionen la rambla que es un asco… Mucha menos inversión y es lo que los rosarinos queremos.",0.97],["social","2026-05-07","Instagram - Orgánico","Negativo","Costanera, río y playas","Un tobogán no atrae turistas, solo deja al rosarino sin playa pública! Una vergüenza",0.97],["social","2026-02-22","Instagram - Orgánico","Negativo","No identificada","Cochabamba 1200 pleno abasto viven apagadas un vientito y se cortan",0.9],["social","2026-06-21","Instagram - Orgánico","Negativo","No identificada","Que darmie hace este cantando en Rosario el día de la bandera?, xd, a falta de Fito esta la trova. Cualquiera.",0.89],["social","2026-07-31","Instagram - Orgánico","Negativo","No identificada","Tanta importancia le dan al Bosque de los constituyentes ..... un pedazo de campo ...... y al Prque regional Sur .... que es un bosque autóctono.... lo estan llenado de cemento .... son desastrosamente vergonzosos",0.98],["social","2025-10-05","Facebook - Orgánico","Negativo","Seguridad","Encima rosario está cada vez peor por la delincuencia y estos de toman el tiempo para boludiar 😡",0.98],["social","2026-01-12","Facebook - Anuncio","Negativo","Barrios y territorio","ROSARIO SIN LUZ......ZONA SUR barrio LA GUARDIA",0.59],["social","2026-05-17","Instagram - Orgánico","Negativo","Obras y espacio público","pone el parque en otro lado pablito, al lado del rio no",0.6],["social","2025-11-24","Facebook - Orgánico","Negativo","No identificada","Ese tobogán está muy alto Lo chico cuando setiran se golpean Le van atener que Aser algo",0.91],["social","2025-09-13","Instagram - Orgánico","Negativo","Seguridad","Nos acaban de robar la moto montevideo y Sarmiento, Años de laburo para comprarla y en 2 segundos todo arruinado. La policía ni siquiera nos toma la denuncia. EXCELENTE LABURO DE TODOS EN ROSARIO. Siempre al servicio de ciudadano.",0.93],["social","2026-01-27","Facebook - Anuncio","Negativo","Gestión municipal e Intendente","Deja de publicar mentiras Javkin,sos un zorro,porque engañas así a la gente,usurero, demoras interminables de noche,días caradura!!!!",0.97],["social","2026-06-26","Instagram - Orgánico","Negativo","Obras y espacio público","Y con la plaza de Bolivia al 600 bis, que el municipio vendió a un privado, que va a pasar?",0.85],["social","2026-06-10","Facebook - Orgánico","Negativo","No identificada","Tengo una idea brillante!! Por qué no desalojan todos los clubes que están sobre la costa y ganamos ESE ESPACIO USURPADO HACE AÑOS ???? 😎👊🏻",0.62],["social","2026-01-18","Instagram - Orgánico","Incierto","No identificada","No se asfixian tanta gente junta?",0.51],["social","2026-07-16","Instagram - Orgánico","Incierto","Residuos y limpieza","Nos falta poner e práctica, pensar en el otro y pensar en la limpieza de nuestro querido monumento a la bandera.",0.55],["social","2025-09-27","Instagram - Orgánico","Incierto","Arbolado","Que bueno sería que hagan mantenimiento, son árboles muy viejos.",0.37],["social","2025-12-21","Facebook - Orgánico","Incierto","No identificada","Y no hablamos de la sanata del presupuesto Party-cipativo...",0.53],["social","2026-05-25","Instagram - Orgánico","Incierto","Arbolado","Queremos recuperar árboles talados. Queremos recuperar vegetación autóctona. Queremos disfrutar de playas públicas. Queremos nuestro rio Paraná. Queremos conciencia y educación ambiental.",0.52],["social","2026-05-15","Instagram - Orgánico","Incierto","No identificada","No seas tosca. Lee el proyecto. Y te vas a dar cuenta que va a beneficiar a todos",0.46],["social","2026-03-24","Instagram - Orgánico","Incierto","Obras y espacio público","Desde el gobierno de Binner no se hizo tanto por el espacio público, más de 70 plazas inauguradas para el disfrute de la gente",0.44],["social","2026-06-20","Facebook - Orgánico","Incierto","No identificada","Ieales a nuestra bandera abel",0.48],["social","2025-12-31","Facebook - Orgánico","Incierto","Residuos y limpieza","Pasaron por la calle Dr Riva a limpiar el contenedor. Tirando agua dentro. Cuando se van, me asomo y el contenedor tenía hasta la mitad de basura. Que lavaron? La basura?...",0.53],["social","2026-05-14","Instagram - Orgánico","Incierto","Costanera, río y playas","No al parque acuático!!!!",0.55],["social","2025-10-07","Facebook - Orgánico","Incierto","Tributos y TGI","La Fiestita q pagamos Todos con la TGI,API y demás impuestos👋🏻👋🏻👋🏻👋🏻",0.49],["social","2026-02-24","Instagram - Orgánico","Incierto","No identificada","@economiasocialrosario che, y la gente de Las 3 ecologias cómo andará?? A los de la feria también los van a desalojar??",0.54],["social","2026-05-14","Instagram - Orgánico","Incierto","Costanera, río y playas","NO AL PARQUE ACUÁTICO EN LA RAMBLA. Es un espacio público, histórico, cultural y natural. Debe ser preservado no vendido y explotado por manos privadas. Viernes sábado y domingo nos vemos en la RAMBLA para defenderla.",0.49],["social","2026-05-14","Instagram - Orgánico","Incierto","Costanera, río y playas","NO AL PARQUE ACUÁTICO, QUEREMOS LA PLAYA TAL Y COMO ESTÁ. LA RAMLA NO SE TOCA, ES PATRIMONIO DE TODXS LXS ROSARINXS!!!",0.5],["social","2026-01-04","Facebook - Orgánico","Incierto","No identificada","aprovechen porque termina la temporada y no ha vuelo a ningún lado",0.52],["social","2025-08-29","Facebook - Orgánico","Incierto","No identificada","PEROOO CLAAAA EN EPOCA DE ELECCIONES APARECEN TODOS LOS PROYECTOS",0.55],["social","2026-05-15","Instagram - Orgánico","Incierto","Costanera, río y playas","NO AL PARQUE ACUÁTICO!!! 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥",0.55],["social","2025-09-11","Facebook - Orgánico","Incierto","Calles y veredas","Jose Luis Olazarán pregunta y cuando llega a bv Oroño está el cantero reducido y el caño de gas como crusa las calles transversales",0.53],["social","2026-05-23","Instagram - Orgánico","Incierto","Costanera, río y playas","Botón de NO AL PARQUE ACUÁTICO ------>",0.54],["social","2026-05-21","Instagram - Anuncio","Incierto","Costanera, río y playas","NO AL PARQUE ACUÁTICO EN LA RAMBLA",0.55],["social","2026-05-17","Instagram - Orgánico","Incierto","Costanera, río y playas","NO AL PARQUE ACUÁTICO!❌❌❌❌",0.55],["social","2025-11-20","Instagram - Orgánico","Incierto","Calles y veredas","Arreglen las calles y veredas",0.5],["social","2026-05-11","Instagram - Orgánico","Incierto","Costanera, río y playas","NO AL PARQUE ACUÁTICO EN LA RAMBLA",0.55],["social","2025-08-23","Facebook - Orgánico","Incierto","Gestión municipal e Intendente","Javkin= Pullaro= Milei Ni olvido ni perdón",0.49],["social","2026-05-15","Instagram - Orgánico","Incierto","Costanera, río y playas","SAQUEN LOS CLUBES QUE ESTAN EN LA COSTANERA DE TODOS LOS ROSARINOS",0.54],["social","2026-05-27","Instagram - Orgánico","Incierto","Gestión municipal e Intendente","@balbiuriell a Macri el amigote de Javkin y Pullaro",0.54],["social","2026-02-25","Facebook - Orgánico","Incierto","No identificada","Sandra Mariana Grasso Tenes razón. Disculpame.",0.53],["social","2026-05-19","Facebook - Orgánico","Incierto","No identificada","Ojo que se morfan los 😼en rosario",0.46],["social","2025-09-11","Instagram - Orgánico","Incierto","No identificada","@salvaggiocecilia no, se las comE",0.44],["social","2026-06-26","Instagram - Orgánico","Incierto","No identificada","@sixtorobledo Kuka tenía que ser.",0.49],["encuesta","2026-06-10","Valoración BOT - 5 items escrita","Positivo","Licencia de conducir","Gracias por la amabilidad de poder ayudarme a poder sacar un turno para renovar mi licencia!!!",0.78],["encuesta","2025-10-25","Valoración BOT - 5 items escrita","Positivo","MuniBot y atención digital","Está buena la idea del munibot pero estaría bueno también que haya atención humana del otro lado, gracias!",0.74],["encuesta","2025-12-16","Valoración BOT - 5 items escrita","Positivo","Calles y veredas","muchas gracias ! espero pronta respuesta !!",0.61],["encuesta","2026-02-16","Valoración BOT - 5 items escrita","Positivo","Residuos y limpieza","Me parece muy útil el sistema. Espero los resultados para evaluar más correctamente",0.92],["encuesta","2025-11-04","Valoración BOT - 5 items escrita","Positivo","Arbolado","Muy buena la atencion, muchas gracias",0.97],["encuesta","2025-09-01","Valoración BOT - 5 items escrita","Positivo","Calles y veredas","Estuvo perfecta y ágil la conversación",0.96],["encuesta","2026-02-16","Valoración BOT - 5 items escrita","Positivo","Residuos y limpieza","Muy eficaz este medio de comunicación 🙌🏻",0.87],["encuesta","2026-07-27","Valoración BOT - 5 items escrita","Positivo","Licencia de conducir","Gracias por la rapidez de la atención",0.9],["encuesta","2026-01-12","Valoración BOT - 5 items escrita","Positivo","Residuos y limpieza","Sigan así están haciendo una buena gestión, gracias",0.96],["encuesta","2026-04-07","Valoración BOT - 5 items escrita","Positivo","Alumbrado público","La rapidez en las respuestas y muy claras",0.73],["encuesta","2025-12-18","Valoración BOT - 5 items escrita","Positivo","Alumbrado público","Excelente y rápida atención",0.8],["encuesta","2025-11-19","Valoración BOT - 5 items escrita","Positivo","Alumbrado público","Nada que decir todo esta muy bien gracias",0.95],["encuesta","2025-09-09","Valoración BOT - 5 items escrita","Positivo","Calles y veredas","Por ahora bien muchas gracias!",0.82],["encuesta","2026-07-29","Valoración BOT - 5 items escrita","Positivo","MuniBot y atención digital","Muy buena atención, gracias",0.97],["encuesta","2025-09-25","Valoración BOT - 5 items escrita","Positivo","Multas y liberación de vehículos","Muchas gracias por la excelente atención",0.95],["encuesta","2026-01-23","Valoración BOT - 5 items escrita","Positivo","Calles y veredas","Muy buena , fácil y rápida",0.91],["encuesta","2026-07-03","Valoración BOT - 5 items escrita","Positivo","Calles y veredas","Agradecido x la atención prestada",0.88],["encuesta","2026-03-17","Valoración BOT - 5 items escrita","Positivo","Calles y veredas","muy contento con tu servicio gracias",0.96],["encuesta","2025-09-11","Valoración BOT - 5 items escrita","Positivo","Calles y veredas","Excelente atención rápida y sencillo",0.69],["encuesta","2026-06-09","Valoración BOT - 5 items escrita","Positivo","Alumbrado público","Fue muy rápida y buena la atención esperemos ahora q lo solucionen",0.88],["encuesta","2026-07-16","Valoración BOT - 5 items escrita","Positivo","Alumbrado público","Muy buena la atención, sencilla y eficaz",0.97],["encuesta","2025-10-16","Valoración BOT - 5 items escrita","Positivo","Calles y veredas","Muy bueno este sistema de reclamos . Gracias",0.95],["encuesta","2026-03-05","Valoración BOT - 5 items escrita","Positivo","Alumbrado público","Espero que vayan a revisar y lo resuelvan",0.56],["encuesta","2026-04-27","Valoración BOT - 5 items escrita","Positivo","Ruidos molestos","Gracias por recibir mí reclamo",0.65],["encuesta","2025-10-07","Valoración BOT - 5 items escrita","Positivo","Alumbrado público","Rápido y práctico. Espero que puedan reparar la luminaria pronto",0.58],["encuesta","2025-10-30","Valoración BOT - 5 items escrita","Positivo","Residuos y limpieza","Hasta ahora, los reclamos x aquí han sido rápidamente resueltos. Felicitaciones.",0.81],["encuesta","2026-08-09","Valoración BOT - 5 items escrita","Positivo","Calles y veredas","Es un buen sistema, espero que de resultados que el reclamo se resuelva",0.93],["encuesta","2025-09-27","Valoración BOT - 5 items escrita","Positivo","Alumbrado público","Excelente herramienta para resolver los problemas al ciudadano.",0.75],["encuesta","2026-03-04","Valoración BOT - 5 items escrita","Positivo","Residuos y limpieza","Sigan asi, muy buen servicio al vecino. Gracias.",0.97],["encuesta","2026-04-23","Valoración BOT - 5 items escrita","Positivo","Obras y espacio público","falta obras en los barrios.. MUY bueno lo que se hizo con roullón..",0.93],["encuesta","2025-11-28","Valoración BOT - 5 items escrita","Neutro","MuniBot y atención digital","Rápido el bot y el accionar",0.83],["encuesta","2026-03-21","Valoración BOT - 5 items escrita","Neutro","Agenda, cultura y deportes","No encontré lo que necesita saber",0.61],["encuesta","2025-12-09","Valoración BOT - 5 items escrita","Neutro","Residuos y limpieza","En la opción 7 de residuos no está la opción solo de basura",0.75],["encuesta","2026-01-14","Valoración BOT - 5 items escrita","Neutro","Calles y veredas","Gracias por todo. Solo necesitamos se den curso a los reclamos realizados en el día de la fecha. Gracias",0.63],["encuesta","2026-07-18","Valoración BOT - 5 items escrita","Neutro","Multas y liberación de vehículos","La multa debería ser instantánea con la foto",0.81],["encuesta","2025-09-11","Valoración BOT - 5 items escrita","Neutro","Licencia de conducir","Está bien la aplicación pero debería llevarte a la aplicación buscada directamente sería más práctico",0.79],["encuesta","2026-01-21","Valoración BOT - 5 items escrita","Neutro","MuniBot y atención digital","En otros temas, debería haber más opciones",0.76],["encuesta","2026-04-09","Valoración BOT - 5 items escrita","Neutro","Tributos y TGI","Espero respuesta de una consulta que hice por Mail",0.77],["encuesta","2026-03-05","Valoración BOT - 5 items escrita","Neutro","Barrios y territorio","Presten atención a los reclamos de los vecinos ,nadie sabe mejor que nosotros lo que sucede en el barrio y como se comporta la municipalidad en su obligación de repararlo .....",0.61],["encuesta","2025-10-26","Valoración BOT - 5 items escrita","Neutro","Arbolado","Espero que lo puedan sacar x favor",0.64],["encuesta","2025-10-07","Valoración BOT - 5 items escrita","Neutro","Arbolado","Quiero corregir el número de reclamo",0.84],["encuesta","2025-11-23","Valoración BOT - 5 items escrita","Neutro","Alumbrado público","Espero q vuelva la luz gracias",0.58],["encuesta","2026-01-09","Valoración BOT - 5 items escrita","Neutro","Transporte público","Actividades para niños hoy",0.69],["encuesta","2025-09-24","Valoración BOT - 5 items escrita","Neutro","Bicicletas","Encontré toda la información.",0.77],["encuesta","2025-09-06","Valoración BOT - 5 items escrita","Neutro","Barrios y territorio","Necesitamos que se acerquen más a los barrios tenemos los mismo derechos que y necesidades que los vecinos del que viven en el centro",0.56],["encuesta","2025-12-16","Valoración BOT - 5 items escrita","Neutro","Multas y liberación de vehículos","Quiero hablar con una persona no con un robots",0.59],["encuesta","2026-04-12","Valoración BOT - 5 items escrita","Neutro","Arbolado","Atención rápida. Espero que la solución sea igual . Gracias",0.74],["encuesta","2026-05-27","Valoración BOT - 5 items escrita","Neutro","Licencia de conducir","Sólito turno para duplicado de licencia de conducir vigente perdida",0.82],["encuesta","2026-02-04","Valoración BOT - 5 items escrita","Neutro","Ruidos molestos","Resultados, consigan resolver los problemas",0.62],["encuesta","2025-10-11","Valoración BOT - 5 items escrita","Neutro","Licencia de conducir","Quiero la boleta para pagar",0.84],["encuesta","2026-03-23","Valoración BOT - 5 items escrita","Neutro","Multas y liberación de vehículos","En estos casos , deben considerarse de urgencia y prioridad, y las multas deben ser ejemplares, de esa forma se educa al infractor",0.57],["encuesta","2026-05-07","Valoración BOT - 5 items escrita","Neutro","Licencia de conducir","Pedí que me oriente en dónde bajar el sellado municipal y me manda dirección de pago Yo necesito sacar el sellado",0.7],["encuesta","2025-09-03","Valoración BOT - 5 items escrita","Neutro","Calles y veredas","se puede agilizar el trámite directamente ingresando el CUIL y ya tener acceso directo al problema o reclamo que se está haciendo",0.89],["encuesta","2026-04-14","Valoración BOT - 5 items escrita","Neutro","Transporte público","Porfi urgente separa de 2319 de colectivo",0.75],["encuesta","2026-06-27","Valoración BOT - 5 items escrita","Neutro","Estacionamiento y tránsito","estaría bueno que me envíen algun tipo de registro una vez que hayan pasado a verificar. muchas gracias",0.79],["encuesta","2026-08-06","Valoración BOT - 5 items escrita","Neutro","Multas y liberación de vehículos","Cómo hago para retirar mi moto del corralón ?",0.7],["encuesta","2026-01-12","Valoración BOT - 5 items escrita","Neutro","Alumbrado público","La atencion es rapida veremos si la solucion es tambien rapida",0.78],["encuesta","2025-10-06","Valoración BOT - 5 items escrita","Neutro","Residuos y limpieza","Me gustaría que sea rápido mi reclamo, gracias",0.78],["encuesta","2026-03-16","Valoración BOT - 5 items escrita","Neutro","Tributos y TGI","Gracias por comunicarte con Inmobiliaria Paronzini, nuestro horario de atención es de lunes a viernes de 9 a 13 hs. ¿Cómo podemos ayudarte?",0.77],["encuesta","2026-08-09","Valoración BOT - 5 items escrita","Neutro","Ruidos molestos","Apersonensé y no hagan abandono de persona. Así podrían mejorar!!!",0.56],["encuesta","2025-12-03","Valoración BOT - 5 items escrita","Negativo","Multas y liberación de vehículos","La pagina no funciona para personas que no residen en Rosario, me hicieron una multa de un vehiculo que vendi hace 4 años. Las multas de otra provincia le llegan a la persona q se lo vendi.",0.89],["encuesta","2025-10-15","Valoración BOT - 5 items escrita","Negativo","Licencia de conducir","Me dijeron q mi anterior reclamo estaba resuelto y no es así",0.61],["encuesta","2026-01-06","Valoración BOT - 5 items escrita","Negativo","Tributos y TGI","Si no me ayudan voy a dejar de pagar los impuestos. NO PUEDE SER!!!!!",0.97],["encuesta","2026-01-02","Valoración BOT - 5 items escrita","Negativo","Residuos y limpieza","La aplicación funciona muy bien. Lo que funcionan mal son los empleados municipales. Que 10 trabajan como 1. Y ese uno que trabaja es bastante inoperante. Saludos",0.95],["encuesta","2026-02-27","Valoración BOT - 5 items escrita","Negativo","Alumbrado público","Me derivo. No puede hacer el reclamo. No atendió mi pedido. No me resolvió nada.",0.93],["encuesta","2026-07-30","Valoración BOT - 5 items escrita","Negativo","Residuos y limpieza","Tendrían que solucionar los reclamos a la brevedad, no cuando pasan meses y los vecinos se siguen quejando",0.91],["encuesta","2026-08-03","Valoración BOT - 5 items escrita","Negativo","Multas y liberación de vehículos","Y porq pregunté como saber si una moto está en el corralón y no me solucionaron la pregunta",0.81],["encuesta","2026-03-27","Valoración BOT - 5 items escrita","Negativo","Arbolado","No estoy teniendo respuestas hace mas de un año estoy pidiendo solución",0.91],["encuesta","2026-05-18","Valoración BOT - 5 items escrita","Negativo","Residuos y limpieza","No solucionan el problema",0.9],["encuesta","2025-09-15","Valoración BOT - 5 items escrita","Negativo","Estacionamiento y tránsito","Este reclamo es sobre los lugares para carga y descarga y siempre hay vehículos particulares mal estacionados.",0.9],["encuesta","2026-02-07","Valoración BOT - 5 items escrita","Negativo","Gestión municipal e Intendente","Estaría mejor q una persona pueda asistir mejor los reclamos. Y darle trabajo a la gente. Ya q se paga mucho los servicios y dan mucho q desear el compromiso y trabajo de la municipalidad.",0.95],["encuesta","2026-07-04","Valoración BOT - 5 items escrita","Negativo","Tributos y TGI","La empresa debería trabajar para brindar un servicio al cual pagamos con nuestros impuestos. La empresa está cobrando por un servicio NO SOLUCIONADO.",0.97],["encuesta","2025-10-22","Valoración BOT - 5 items escrita","Negativo","MuniBot y atención digital","No resuelve nada Ya tengo reclamo hace meses sin ninguna solución Tanta gente trabajando en la municipalidad y ponen a contestar un bot",0.95],["encuesta","2025-12-27","Valoración BOT - 5 items escrita","Negativo","Calles y veredas","No solucionan el problema.",0.9],["encuesta","2026-06-25","Valoración BOT - 5 items escrita","Negativo","Calles y veredas","Quería enviar foto y no me permite",0.71],["encuesta","2025-12-21","Valoración BOT - 5 items escrita","Negativo","Estacionamiento y tránsito","Jamas cumplen con los reclamos",0.89],["encuesta","2026-05-25","Valoración BOT - 5 items escrita","Negativo","Ruidos molestos","Vergonzoso lo que sufrimos permanente los vecinos",0.98],["encuesta","2026-07-08","Valoración BOT - 5 items escrita","Negativo","Alumbrado público","RESUELVAN EL PROBLEMA. HACE 1 AÑO Y MEDIO SIN SERVICIO DE ALUMBRADO PÚBLICO",0.86],["encuesta","2025-10-06","Valoración BOT - 5 items escrita","Negativo","Barrios y territorio","Es la 3 era vez que hago este reclamo y no tenemos respuestas los vecinos del barrio",0.95],["encuesta","2026-03-28","Valoración BOT - 5 items escrita","Negativo","Calles y veredas","No está la opción para reclamar enumerada en la lista",0.65],["encuesta","2026-04-27","Valoración BOT - 5 items escrita","Negativo","Calles y veredas","No pude hacer el reclamo después de 2 intentos.",0.71],["encuesta","2025-09-19","Valoración BOT - 5 items escrita","Negativo","Residuos y limpieza","No pude saber donde desechar máquinas fotografías.",0.61],["encuesta","2025-11-05","Valoración BOT - 5 items escrita","Negativo","Estacionamiento y tránsito","No dan todas la opciones de denuncia, no es ágil la interacción",0.92],["encuesta","2025-09-20","Valoración BOT - 5 items escrita","Negativo","Anegamiento y desagües","Es rápido para hacer el reclamo, pero no me soluciona los problemas",0.89],["encuesta","2025-12-23","Valoración BOT - 5 items escrita","Negativo","MuniBot y atención digital","No me acuerdo la contraseña del perfil digital",0.58],["encuesta","2025-11-24","Valoración BOT - 5 items escrita","Negativo","Alumbrado público","La gente de alumbrado dan por cerrado el caso , sin apersonarse , hace 5 días quE ESTAMOS ASÍ,NECESITO INTERVENCIÓN URGENTE, GRACIAS",0.92],["encuesta","2026-05-17","Valoración BOT - 5 items escrita","Negativo","Arbolado","Por favor, éste árbol se va a caer sobre la casa",0.96],["encuesta","2025-09-02","Valoración BOT - 5 items escrita","Negativo","Calles y veredas","Deberían regular la opción de número de cuil que lo envié varias veces y no me lo reconocían gracias",0.65],["encuesta","2026-07-16","Valoración BOT - 5 items escrita","Negativo","MuniBot y atención digital","A la espera de una pronta respuesta, entiendo que por mi zona pasan los días lunes y pasaron 2 lunes… Me preocupa la tormenta que se avecina",0.92],["encuesta","2025-11-07","Valoración BOT - 5 items escrita","Negativo","Calles y veredas","Muchas obras avanzando y pavimentaciones veredas y afalto pero algunos barrios estamos a la deriva",0.92],["encuesta","2026-01-23","Valoración BOT - 5 items escrita","Incierto","MuniBot y atención digital","Necesito sacar un turno para la revisacion medica y me dice que no se puede que esta mal mi fecha de nacimiento pero tengo la identidad verificada",0.53],["encuesta","2026-05-06","Valoración BOT - 5 items escrita","Incierto","Calles y veredas","La app es muy buena, la solución al problema no tanto...",0.52],["encuesta","2025-12-05","Valoración BOT - 5 items escrita","Incierto","Calles y veredas","Para mejorar....reparen las calles!!!",0.53],["encuesta","2026-05-19","Valoración BOT - 5 items escrita","Incierto","Calles y veredas","Ojalá solucionen el problema del bache pronto.",0.53],["encuesta","2025-09-22","Valoración BOT - 5 items escrita","Incierto","Calles y veredas","En esta cuadra la calle está rota, muchas gracias",0.51],["encuesta","2025-11-16","Valoración BOT - 5 items escrita","Incierto","Multas y liberación de vehículos","No sirve, apredan programación y después prueben los programas.",0.5],["encuesta","2026-02-23","Valoración BOT - 5 items escrita","Incierto","Transporte público","Debería existir una opción de hacer una consulta relacionada al tema para consultas o dudas que no estén entre las opciones",0.5],["encuesta","2026-02-08","Valoración BOT - 5 items escrita","Incierto","Alumbrado público","Sería bueno poder hablar con una persona y explicar el problema y que nos de respuesta a la solución",0.52],["encuesta","2025-09-24","Valoración BOT - 5 items escrita","Incierto","Barrios y territorio","Necesito que resuelvan los problemas del barrio.",0.48],["encuesta","2026-02-12","Valoración BOT - 5 items escrita","Incierto","Ruidos molestos","Hasta ahora han respondido a mis reclamos.",0.5],["encuesta","2025-12-01","Valoración BOT - 5 items escrita","Incierto","Arbolado","Mejoren la poda de árboles",0.55],["encuesta","2025-10-03","Valoración BOT - 5 items escrita","Incierto","Residuos y limpieza","Falta de opciones para reclamos",0.54],["encuesta","2025-12-26","Valoración BOT - 5 items escrita","Incierto","Calles y veredas","Comprendo que ahora todo sea por mensajes,pero es mucho mejor tener un diálogo para así poder comunicar mejor los problemas que nos surgen a los vecinos, gracias.",0.53],["encuesta","2026-03-12","Valoración BOT - 5 items escrita","Incierto","Ruidos molestos","Ayúdenme necesito dormir para trabajar mañana me levanto 6 am",0.53],["encuesta","2025-09-18","Valoración BOT - 5 items escrita","Incierto","Arbolado","Espero nos puedan ayudar, ya que somos 3 vecinos como mínimo que estamos con este problema",0.52],["encuesta","2025-10-27","Valoración BOT - 5 items escrita","Incierto","Alumbrado público","Necesitamos urgente la luz de la calle y mantenimiento de las calles",0.49],["encuesta","2026-06-10","Valoración BOT - 5 items escrita","Incierto","MuniBot y atención digital","Aunq no resolví mi duda... Mi experiencia fue buena!!!",0.52],["encuesta","2026-05-29","Valoración BOT - 5 items escrita","Incierto","Multas y liberación de vehículos","Nesecito sacar turno para el juez de falta y no lo logro. (No se como) igual gracias",0.52],["encuesta","2026-06-14","Valoración BOT - 5 items escrita","Incierto","Ruidos molestos","Espero que respondan a mi reclamo con una solución real y que esto no sea solo un filtro para canalizarlos sin dar ninguna respuesta. Necesito una solución definitiva, tanto para poder dormir hoy pero tambien todos los dias futuros.",0.53],["encuesta","2025-11-05","Valoración BOT - 5 items escrita","Incierto","Calles y veredas","Mejorarán cuando además de escuchar los reclamos, solucionen los problemas en el corto plazo. No es tan difícil arreglar una vereda",0.48],["encuesta","2026-01-07","Valoración BOT - 5 items escrita","Incierto","Multas y liberación de vehículos","No pude resolver el problema, necesitaba la opción de hablar con alguien o la opción de hacer un convenio para pagar",0.5],["encuesta","2026-03-23","Valoración BOT - 5 items escrita","Incierto","Ruidos molestos","Es buena la gestión automática. Solo pondría más nota en caso de que los reclamos realmente se resuelvan",0.55],["encuesta","2025-10-06","Valoración BOT - 5 items escrita","Incierto","No identificada","Da información pero no opciones para solucionar el inconveniente.",0.5],["encuesta","2026-06-19","Valoración BOT - 5 items escrita","Incierto","Residuos y limpieza","Esperemos que en el fin de semana no tiren más basura allí y se acreciente el tamaño de la basura",0.54],["encuesta","2025-12-01","Valoración BOT - 5 items escrita","Incierto","Alumbrado público","Saavedra 1700, toda la cuadra también apagada. Italia y Saavedra. Muchas gracias",0.55],["encuesta","2025-12-01","Valoración BOT - 5 items escrita","Incierto","Alumbrado público","No pidan cuit/ cuil ,pidan número documento,la gente a veces no recuerdo cuit/cuil",0.51],["encuesta","2026-08-04","Valoración BOT - 5 items escrita","Incierto","Calles y veredas","Que lo vengan a retirar y ahi doy mi puntales correcto, hace 4 dias q estan las ramas tiradas en mi vereda",0.54],["encuesta","2026-01-08","Valoración BOT - 5 items escrita","Incierto","Arbolado","Si que pronto puedan resolver el tema",0.51],["encuesta","2025-11-25","Valoración BOT - 5 items escrita","Incierto","Alumbrado público","Duo atendido enseguida gracias",0.51],["encuesta","2026-05-03","Valoración BOT - 5 items escrita","Incierto","Residuos y limpieza","Me alegra poder resolver por el celular sin tener que ir al navegador, que me resulta más tedioso",0.41],["privada","2025-09-06","instagram_private","Positivo","MuniBot y atención digital","Que tengas un excelente día 😘",0.94],["privada","2026-03-28","incoming_whatsapp","Positivo","MuniBot y atención digital","¡Ya me llegó $ 800.000, animate vos también, es re fácil! [URL]",0.69],["privada","2026-04-04","instagram_private","Positivo","Ruidos molestos","POR FAVOR !!!! La música de TAURA está dentro de mi hogar!!!!",0.66],["privada","2026-05-22","facebook_private","Positivo","Gestión municipal e Intendente","Gracias por cuidarlo señor intendente Dios los bendiga 🙏",0.94],["privada","2026-06-04","instagram_private","Positivo","Arbolado","Recibí buena atención por este medio",0.77],["privada","2025-10-08","instagram_private","Positivo","Imagen e identidad de Rosario","Hermosa Rosario!!!! Mi CIUDAD. Lo seguirás siendo siempre. Te llevo en mi Corazón ❤️",0.94],["privada","2026-07-06","instagram_private","Positivo","Gestión municipal e Intendente","muni_rosario FELICIDADES!!, vas a ser uno de los primeros en escuchar mi nueva cancion, TOCA LAS LETRAS AZULES de aca abajo y te lleva directo.🚀 ⬇️⬇️⬇️ <a target=\" _blank\" href=\" [URL]",0.92],["privada","2025-11-14","instagram_private","Positivo","MuniBot y atención digital","Muy bueno , con mi padre realizamos todo el planteo , bases , encadenados , contrapisos , carpetas , colocación de porcelanatos, pisos de hormigon , en ese lugar .",0.83],["privada","2025-09-17","instagram_private","Positivo","Calles y veredas","SII!! Muy bueno.. ahora por calle caferatta, iriondo, verá Mujica.. barrio san francisquito es un solo pozo",0.73],["privada","2026-06-08","instagram_private","Positivo","MuniBot y atención digital","Me gusta hacer las cosas gratis para que todos aprendan",0.92],["privada","2025-10-07","instagram_private","Positivo","MuniBot y atención digital","Bendiciones volvé te amamos 🙌🙌🙌💕💕💕💕",0.68],["privada","2026-04-10","facebook_private","Positivo","No identificada","Me voy a comprar medicamentos. Gracias por todo !! Vuelvo enseguida ....",0.65],["privada","2026-04-06","incoming_whatsapp","Positivo","Multas y liberación de vehículos","Gracias por la atención nos estamos viendo!! Muy amable",0.94],["privada","2026-02-25","instagram_private","Positivo","Agenda, cultura y deportes","Festival de la patria mia",0.62],["privada","2026-06-21","instagram_private","Positivo","Gestión municipal e Intendente","Felicitaciones a la municipalidad de Rosario",0.91],["privada","2026-01-01","facebook_private","Positivo","No identificada","Juegos de luces, show como las grandes ciudades del mundo donde muchas veces nos incluimos ante la recuperación de espacios sociales digno de una ciudad en progreso y creciendo constante",0.88],["privada","2025-10-01","instagram_private","Positivo","MuniBot y atención digital","Son dos espacios que pueden ser aprovechados al 1000",0.89],["privada","2025-09-04","instagram_private","Positivo","Arbolado","La verdad que esta bien gracias",0.95],["privada","2026-02-24","incoming_whatsapp","Positivo","Multas y liberación de vehículos","Eso es lo de menos no tiene drama",0.58],["privada","2025-10-08","instagram_private","Positivo","MuniBot y atención digital","Gran nivel de festejo ,con LA SINFONICA; ARTEEEE",0.96],["privada","2025-11-26","instagram_private","Positivo","Licencia de conducir","Por dios compren estos micros urbanos para ROSARIO y REEMPLACEN TODA flota x esos!!! Son hermosos!!! Los compraron para Bs As !",0.81],["privada","2026-08-03","instagram_private","Positivo","MuniBot y atención digital","Hola! Acá también tenemos esto?… está muy bueno!",0.94],["privada","2025-10-06","instagram_private","Positivo","MuniBot y atención digital","Gracias por dejarme Cantar",0.8],["privada","2025-09-10","instagram_private","Positivo","MuniBot y atención digital","¡Hola! Gracias por ponerte en contacto con nosotros. Recibimos tu mensaje y responderemos a la brevedad. Agradecemos tu interés, ¡Saludos!",0.62],["privada","2026-06-11","instagram_private","Positivo","Residuos y limpieza","Yo ando buscando trabajo y me gusta el trabajo de la recolección",0.62],["privada","2025-09-16","incoming_whatsapp","Positivo","Multas y liberación de vehículos","Muchas gracias por su atención",0.78],["privada","2025-12-17","instagram_private","Positivo","Licencia de conducir","Mi hija participo y ganó el concurso a rodar mí vida, Alumna de diseño gráfico Hermoso trabajo,muchas gracias",0.96],["privada","2026-02-18","incoming_whatsapp","Positivo","Multas y liberación de vehículos","Dale buenísimo gracias muy amable",0.97],["privada","2025-10-28","instagram_private","Positivo","MuniBot y atención digital","Ojalá se los aprueben. Que buena iniciativa para una ciudad que crece cada vez mas. Aplausos para esta idea. Y ver como Rosario no se queda en el tiempo. Y avanza.",0.96],["privada","2026-06-22","instagram_private","Positivo","MuniBot y atención digital","Muy,linda este Dia de la Bandera",0.96],["privada","2026-04-22","facebook_private","Neutro","No identificada","Los espero en roullon y esquiu!!!",0.71],["privada","2026-04-28","instagram_private","Neutro","MuniBot y atención digital","Hola Una consulta quería saber va a estar el carrito haciendo lentes, de que edades y en dónde están?",0.91],["privada","2026-02-27","instagram_private","Neutro","Anegamiento y desagües","Hola, cómo ingreso el pedido de saneamiento del Arroyo Ludueña, sector crítico en el Club Náutico Malvinas Argentinas? Gracias",0.85],["privada","2025-11-18","instagram_private","Neutro","MuniBot y atención digital","Hola! Mi nombre es sofia Realizamos trabajos en MDF para vidrieras de comercios y particulares. Tu consulta no molesta Mi cel [NÚMERO]",0.85],["privada","2026-04-14","instagram_private","Neutro","Estacionamiento y tránsito","Cuál es el valor del bono que se cobra para el estacionamiento por el recital de Ricky martin",0.88],["privada","2026-04-03","instagram_private","Neutro","Licencia de conducir","Necesito hablar con una persona",0.57],["privada","2026-07-29","instagram_private","Neutro","Licencia de conducir","Hola cómo puedo conseguir un turno para renovar licencia D2",0.88],["privada","2025-10-03","facebook_private","Neutro","Gestión municipal e Intendente","Bueno días, a quién corresponda, Intendente, Secretario de Servicios Públicos, empleados del sector",0.83],["privada","2026-01-20","instagram_private","Neutro","Agenda, cultura y deportes","Buen día! Quería hacer una consulta, saqué los qrs para el festival faro pero puse mal el Mail y no me llegaron, tengo alguna forma de recuperarlos con mi dni? Gracias",0.86],["privada","2025-09-09","instagram_private","Neutro","MuniBot y atención digital","Buenos días, por favor podrían facilitarme un número de WhatsApp para poder consultar sobre una patente",0.9],["privada","2026-03-13","instagram_private","Neutro","Alumbrado público","Después de la última tormenta , no encendio más luz d la calle , queria si por favor la arreglan asi esta mejor iluminada , es por calle bielsa , apenas pasas colombia altura aproximada 7019 por rafael bielsa, gracias.",0.68],["privada","2026-06-15","instagram_private","Neutro","Habilitaciones y comercio","Quiero saber cuales son los requisitos para ser feriante",0.91],["privada","2026-01-23","instagram_private","Neutro","MuniBot y atención digital","Podrian explicar de q se trat y donde es .minimamente ?",0.85],["privada","2026-03-05","facebook_private","Neutro","No identificada","Hace falta una en el village para revivirlo un poco.",0.63],["privada","2025-12-22","incoming_whatsapp","Neutro","Tributos y TGI","y la firma tiene que estar certificada por escribano??",0.92],["privada","2026-01-27","instagram_private","Neutro","Agenda, cultura y deportes","Hola! Pedí mis entradas para el festival faro pero no me llegó el qr al mail. Mi dni es [NÚMERO]",0.81],["privada","2026-04-06","instagram_private","Neutro","MuniBot y atención digital","Hola!! Buenas tardes, quería saber si los talleres de puerto joven se cancelan por mal clima.",0.74],["privada","2026-07-07","incoming_whatsapp","Neutro","Agenda, cultura y deportes","Planes para hacer en Rosario con adolescentes",0.71],["privada","2026-02-27","instagram_private","Neutro","MuniBot y atención digital","Buenos días están dictando algún curso de guitarra para adultos mayores?",0.89],["privada","2026-08-08","instagram_private","Neutro","MuniBot y atención digital","Hola! cuando anuncian el ganador del sorteo de entradas de la encuesta sobre outlet rosario",0.91],["privada","2025-09-19","instagram_private","Neutro","MuniBot y atención digital","Buenas, quisiera info o un numero de contacto de la escuela de jardineria por favor. Gracias",0.9],["privada","2026-07-28","instagram_private","Neutro","Multas y liberación de vehículos","Hoy a la mañana lo gestioné con un operador,me había pasado los links de pago lo cual abone y le pase los comprobantes,cuando yo abone en el link de acarreo ,puse opción auto y no moto,termine pagando 44 en vez del monto de moto",0.82],["privada","2026-07-31","instagram_private","Neutro","MuniBot y atención digital","Lugar donde puedo dejar mi curriculum",0.93],["privada","2025-11-18","incoming_whatsapp","Neutro","Alumbrado público","Liniers 1311 (entre Forest y Zapiola al 5400)",0.78],["privada","2026-04-16","instagram_private","Neutro","Barrios y territorio","Hola, buenas tardes. Una consulta, yo me inscribí para el taller de fotografía en el distrito oeste pero no se comunicaron conmigo y creo que ya arrancaron, significa que no quede?",0.82],["privada","2026-02-17","incoming_whatsapp","Neutro","Calles y veredas","Necesito poder hablar con alguien humano a cargo",0.62],["privada","2025-09-26","incoming_whatsapp","Neutro","Multas y liberación de vehículos","Decime cv tanto es el total",0.72],["privada","2025-09-01","instagram_private","Neutro","MuniBot y atención digital","Algún lugar donde se pueda llevar un cv",0.91],["privada","2026-06-12","incoming_whatsapp","Neutro","Estacionamiento y tránsito","En ese edificio están realizando tarea de mantenimiento y están cortando ceramicos por ejemplo en horario de descanso. Desde mí departamento observo que se encuentran en la planta baja y creo que trabajan en la cochera del edificio",0.9],["privada","2026-01-09","instagram_private","Neutro","Multas y liberación de vehículos","Buenas tardes, necesito saber si hay un número de teléfono donde poder contactarme",0.9],["privada","2026-03-17","instagram_private","Negativo","MuniBot y atención digital","Deberían hacer cursos para personas mayores de 40, muchos no pudieron estudiar de jóvenes...",0.83],["privada","2026-02-13","facebook_private","Negativo","Calles y veredas","No pasa el barrendero, ni la barredora, ni los de zanjeo, ni escamonda dónde las LED no iluminan ni las veredas... No sé puede estar de joda cuando no prestan los servicios básicos...",0.96],["privada","2026-04-21","facebook_private","Negativo","Seguridad","Busquen la forma es un bunker que le dan plata a fiscalia al ministro ....a los polivias.....etc Descuenten a los policias",0.83],["privada","2025-10-27","instagram_private","Negativo","Salud y bienestar animal","Buenos días. Mi hija desde el viernes no tiene la medicación que le dan en el hospital provincial. Tiene una enfermedad crónica, colitis ulcerosa y hoy llamó pero siguen sin recibir remedios, alguien que me lo pueda solucionar porfa 🙏.",0.82],["privada","2025-11-09","incoming_whatsapp","Negativo","Alumbrado público","Sector apagado. Solicito intervención",0.66],["privada","2026-03-04","incoming_whatsapp","Negativo","Arbolado","Está lleno de ramas de árboles",0.57],["privada","2025-10-15","incoming_whatsapp","Negativo","Ruidos molestos","Brandoni y Mellian los de siempre",0.78],["privada","2026-01-27","incoming_whatsapp","Negativo","Multas y liberación de vehículos","A que se debe que no se encuentra? Porque el policia me dijo que la iban a llevar directamente ahi, al corralon de calle moreno",0.6],["privada","2025-12-09","instagram_private","Negativo","Arbolado","Póngale onda a la decoración navideño a, es re aburrido el árbol viejo de Pellegrini",0.93],["privada","2026-01-06","instagram_private","Negativo","Calles y veredas","En Arévalo y Perú hay un pozo en el pavimento desde hace dos años.",0.83],["privada","2025-12-06","instagram_private","Negativo","Obras y espacio público","Hace falta una plaza en Juan bautista de la Salle y nicaragua Fisherton industrial están esos llullos altos hay estás tiran mugre haria falta",0.93],["privada","2026-02-26","facebook_private","Negativo","No identificada","Arreglen las vicisenda de avellaneda desde pellegrini a santa fe esta llena de posos y las palmeras te pegan en la cara",0.95],["privada","2026-03-06","instagram_private","Negativo","MuniBot y atención digital","Por que tengo dudas con la fecha",0.73],["privada","2026-02-28","instagram_private","Negativo","Agenda, cultura y deportes","Un belleza todo pero hagan algo con el museo del deporte q está todo oscuro de noche no se luce y encima una mugre hoy a la mañana lleno de botellas de vidrio gracias",0.97],["privada","2025-11-20","incoming_whatsapp","Negativo","Alumbrado público","Cada vez que llueve se corta la luz de alumbrado público",0.96],["privada","2025-12-08","instagram_private","Negativo","Obras y espacio público","Por favor un arbolito 🎄 en la Plaza Pringle está muy triste la zona céntrica! 🙌🏻Gracias 🙏🏻 😇🥰🙏🏻🙌🏻",0.86],["privada","2025-12-16","instagram_private","Negativo","Calles y veredas","Podar árboles de calle Zeballos ya que la mayoría están entedando el cableado",0.67],["privada","2025-11-07","instagram_private","Negativo","Calles y veredas","Noo, porque tuvieron que tapar las vías. Es lo que hace única a Rosario. Es mejorar las calles. No tapar recuerdos.",0.9],["privada","2026-06-03","incoming_whatsapp","Negativo","Multas y liberación de vehículos","porque no pude ir a buscarla el viernes",0.83],["privada","2026-08-09","incoming_whatsapp","Negativo","Ruidos molestos","Hay ruidos muy molestos en frente de mí edificio",0.96],["privada","2025-11-20","incoming_whatsapp","Negativo","Calles y veredas","denuncia a Defensa Civil por una columna que esta por caerse",0.81],["privada","2026-03-26","incoming_whatsapp","Negativo","Alumbrado público","Bruno Casarella, hace mas de 5 dias que hice el reclamo, hasta de forma telefonica y sigue la luminaria apagada, me llegan mensajes como el reclamo finalizado, pero sigue todo el sector apagado",0.88],["privada","2025-11-18","incoming_whatsapp","Negativo","Multas y liberación de vehículos","Cuando la llevaron se la sacaron a ángel joel quiroga",0.59],["privada","2026-03-10","instagram_private","Negativo","Transporte público","Buen día estuve 50 minutos esperando la k en san Juan al 500 ,es una vergüenza, después dicen que hay más unidades 🤬🤬🤬🤬",0.95],["privada","2025-11-22","instagram_private","Negativo","Calles y veredas","Insisto' barrio belgrano no tiene arreglo de calles",0.91],["privada","2025-11-01","instagram_private","Negativo","Calles y veredas","Cortaron cables de internet Uds y dejaron todo sucio en la vereda, tendría darles verguenza",0.97],["privada","2026-04-06","instagram_private","Negativo","Calles y veredas","Definamos \"cuidar\" las calles de la mayoría de los barrios están rotas o mal hechas o cuando van a laburar tardan 4hs o van a trabajar 1h en un día, o tardan MESES en arreglar 100mts o menos",0.92],["privada","2025-08-27","facebook_private","Negativo","Calles y veredas","La peor intendencia de la historia de Rosario, seguí haciendo plazas total las calles de los barrios de Rosario están en total estado de abandono mangas de políticos corruptos delincuentes chorros lacras eso es lo que son todos lacras",0.97],["privada","2025-09-04","instagram_private","Negativo","Arbolado","Ya no se que hacer por la poda en el arbol que esta afuera de casa",0.96],["privada","2026-07-06","facebook_private","Negativo","Calles y veredas","El barrio santa Teresita q estaba después de la guardia para pavimento definitivo q paso lo pasaron de largo contestenme por favor lo empezaron y con la pandemia lo abandonaron y nunca más",0.91],["privada","2025-09-25","instagram_private","Incierto","MuniBot y atención digital","Ninguno es para lo que quiero reclamar",0.52],["privada","2025-10-15","instagram_private","Incierto","Calles y veredas","La epe rompió toda la vereda recién echa",0.46],["privada","2026-03-03","instagram_private","Incierto","MuniBot y atención digital","Gracias operarios municipal es",0.52],["privada","2025-11-10","instagram_private","Incierto","Transporte público","Hola. Saque la entrada para el tren para el domingo,soy jubilada y estuve descompuesta, puedo por favor presentarme otro día Mil gracias",0.55],["privada","2026-04-25","instagram_private","Incierto","MuniBot y atención digital","4 Pero por qué quería hablar con un persona",0.52],["privada","2025-10-01","incoming_whatsapp","Incierto","Multas y liberación de vehículos","Me podés ayudar con otra cosa ?",0.54],["privada","2026-02-15","incoming_whatsapp","Incierto","Calles y veredas","Calles sin luz a dos cuadras a la redonda. Díaz Vélez 1500",0.5],["privada","2025-10-07","incoming_whatsapp","Incierto","Ruidos molestos","Es un domicilio que aparentemente estan reformando, desde las 7am todo el día hasta la tardecita se sienten ruidos muy fuertes de obra tipo \"taladro\" y golpes que retumban y vibran en nuestro edificio incluso los dias sábado.",0.54],["privada","2026-06-10","instagram_private","Incierto","Multas y liberación de vehículos","Hola, soy de Santa Fe capital y me llegó una multa de un auto que no es mío. Como me comunico por teleprompter?",0.51],["privada","2026-05-14","incoming_whatsapp","Incierto","Alumbrado público","Reclamo colectivo choco columna de alumbrado",0.55],["privada","2025-10-30","incoming_whatsapp","Incierto","Multas y liberación de vehículos","Y con flete no se puede retirar?",0.51],["privada","2026-03-16","instagram_private","Incierto","Licencia de conducir","Jaaaaáa !!!! Fue un chiste no ????",0.52],["privada","2025-10-31","incoming_whatsapp","Incierto","Seguridad","En total estado de ebriedad y amenazando no pude llamar a la policía porque ya se retiraba pero en mi cámara quedo registrado que estuvo dos horas de visita en el pasillo de al lado 1 de mayo 3142",0.55],["privada","2025-12-30","instagram_private","Incierto","Residuos y limpieza","Hola. Tengo bolsas de basura grandes, escombros",0.5],["privada","2026-08-01","incoming_whatsapp","Incierto","Multas y liberación de vehículos","Quiero saber si no podes cambiarlo a nombre mío para poder retirarlo yo porq mi novia está trabajando",0.55],["privada","2026-05-24","facebook_private","Incierto","Costanera, río y playas","Con lo bella q es la costa de mi ciudad le quieren poner un parque acuático. La rambla no se toca.",0.4],["privada","2026-01-07","instagram_private","Incierto","MuniBot y atención digital","Quiero hablar con alguien",0.54],["privada","2025-08-20","facebook_private","Incierto","Agenda, cultura y deportes","Lleno total ☝️Chile \"Teatro Cariola\" a sold-out.",0.54],["privada","2025-12-01","instagram_private","Incierto","Agenda, cultura y deportes","Hola, me dice no disponible. No hay más cupos?",0.52],["privada","2026-04-15","instagram_private","Incierto","Multas y liberación de vehículos","Quería hacer una consulta por una multa que creo que se pagó 2 veces",0.5],["privada","2026-04-11","incoming_whatsapp","Incierto","Estacionamiento y tránsito","Autos mal estacionados en punta de línea Mazul San Nicolas al 675",0.49],["privada","2026-05-08","instagram_private","Incierto","Agenda, cultura y deportes","Recitales y actividades gratuitas",0.55],["privada","2025-08-28","incoming_whatsapp","Incierto","Multas y liberación de vehículos","Jaja ay Sandra como nos vamos a reír algún día de esto jaja",0.43],["privada","2026-08-06","instagram_private","Incierto","MuniBot y atención digital","necesitamos asistencia los vecinos de bv Seguí al 500, tenemos invasión de ratones. por favor",0.52],["privada","2026-08-09","instagram_private","Incierto","Agenda, cultura y deportes","Evento de Redi, festejos de las infancias",0.48],["privada","2026-02-09","facebook_private","Incierto","Gestión municipal e Intendente","Y la zona Regimiento 11 hasta Arijon, para 2029, dejen de embromar, no nos tomen de idiota, tengo mucho para decirle al Sr, Intendente, me encantaría que me escuche.",0.51],["privada","2026-02-12","facebook_private","Incierto","Obras y espacio público","Buenos días ya que hacen tantas obras Rucci necesitas plazas nuevas hay muchos chicos no salamentes adelante de las villas por favor acuérdense del barrio Rucci",0.49],["privada","2026-08-07","instagram_private","Incierto","Agenda, cultura y deportes","Hola cómo estás soy Lore Serra de FM Winner y vecina de aquí , me gustaría información para la audiencia y para mis redes sociales sobre este maravilloso evento y esta nueva obra",0.55],["privada","2025-09-18","incoming_whatsapp","Incierto","Calles y veredas","Buenos días Pedí el esfuerzo compartido en el reclamo número [NÚMERO]el cual me dijeron que dentro de los dos meses se iban a contactar y vamos para el 3er mes y no se contactaron",0.5],["privada","2026-08-06","facebook_private","Incierto","No identificada","Y la restitución de la 136/137 al recorrido anterior para cuando",0.53]]};

/* ---------------------------- tokens ---------------------------- */
const C = {
  bg: "#000000",
  surface: "#0D1014",
  surfaceHi: "#141920",
  border: "#1E252E",
  borderHi: "#2C3742",
  text: "#F2F5F8",
  dim: "#98A3AE",
  dimmer: "#6B7681",
  accent: "#4C9AF5",
};
const TONE = {
  Positivo: { c: "#4C9AF5", dash: null },
  Neutro: { c: "#E3E8ED", dash: "6 4" },
  Negativo: { c: "#D9822B", dash: null },
  Incierto: { c: "#7E8A97", dash: "2 4" },
};
const TONES = ["Positivo", "Neutro", "Negativo", "Incierto"];

/* --------------------------- formato --------------------------- */
const nf = new Intl.NumberFormat("es-AR");
const n0 = (v) => nf.format(Math.round(v || 0));
const pc = (v, d = 1) =>
  (v == null || !isFinite(v) ? "—" : v.toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d }) + "%");
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const mesLabel = (m) => {
  const [y, mm] = m.split("-");
  return `${MES[+mm - 1]} ${y}`;
};
const fechaLabel = (d) => {
  const [y, m, dd] = d.split("-");
  return `${dd}/${m}/${y.slice(2)}`;
};

/* ------------------------ textos de fuente ---------------------- */
const NOTAS = {
  encuesta: {
    titulo: "Encuesta",
    texto:
      "Comentarios escritos por los usuarios al responder las encuestas de satisfacción vinculadas a MuniBot. Cada fila es una respuesta o comentario de encuesta. Es una exportación completa, por lo que cada registro tiene peso 1.",
    unidad: "respuestas de encuesta",
  },
  social: {
    titulo: "Social público",
    texto:
      "Comentarios públicos realizados en publicaciones orgánicas y anuncios de Facebook e Instagram. Cada fila es un comentario público. También es una exportación completa y cada registro tiene peso 1.",
    unidad: "comentarios públicos",
  },
  privada: {
    titulo: "Conversación privada",
    texto:
      "Mensajes enviados por ciudadanos dentro de conversaciones privadas de WhatsApp, Instagram y Facebook. Cada fila es un mensaje ciudadano, no una conversación completa. Como se trabajó con una muestra, se utiliza la ponderación para estimar el volumen total.",
    unidad: "mensajes ciudadanos (estimado)",
  },
};
const FUENTES = [
  { k: "social", n: "Social público" },
  { k: "encuesta", n: "Encuesta" },
  { k: "privada", n: "Conversación privada" },
];

const PERIODOS = [
  { k: "all", n: "Todo el histórico" },
  { k: "3", n: "Últimos 3 meses" },
  { k: "6", n: "Últimos 6 meses" },
  { k: "12", n: "Últimos 12 meses" },
  { k: "custom", n: "Rango personalizado" },
];

/* =================================================================
   Componente principal
================================================================= */
export default function EscuchaCiudadana() {
  const months = DATA.months;
  const [fuente, setFuente] = useState("social");
  const [periodo, setPeriodo] = useState("all");
  const [desde, setDesde] = useState(months[0]);
  const [hasta, setHasta] = useState(months[months.length - 1]);

  const rango = useMemo(() => {
    if (periodo === "custom") {
      let a = months.indexOf(desde), b = months.indexOf(hasta);
      if (a > b) [a, b] = [b, a];
      return [a, b];
    }
    if (periodo === "all") return [0, months.length - 1];
    const n = parseInt(periodo, 10);
    return [Math.max(0, months.length - n), months.length - 1];
  }, [periodo, desde, hasta, months]);

  const S = DATA.sources[fuente];
  const nota = NOTAS[fuente];

  /* ---------------- agregados del período ---------------- */
  const agg = useMemo(() => {
    const [a, b] = rango;
    const acc = new Array(11).fill(0);
    for (let i = a; i <= b; i++) S.byMonth[i].forEach((v, j) => (acc[j] += v));
    const tono = {};
    TONES.forEach((t, k) => (tono[t] = acc[6 + k]));
    const analizables = TONES.reduce((s, t) => s + tono[t], 0);
    return {
      total: acc[0], filas: acc[1], analizable: acc[2], filasAnalizables: acc[3],
      conTema: acc[4], filasConTema: acc[5], frustracion: acc[10], tono, analizables,
    };
  }, [S, rango]);

  /* ---------------- serie mensual ---------------- */
  const serie = useMemo(() => {
    const [a, b] = rango;
    const r = [];
    for (let i = a; i <= b; i++) {
      const m = S.byMonth[i];
      r.push({
        mes: mesLabel(months[i]),
        Positivo: m[6], Neutro: m[7], Negativo: m[8], Incierto: m[9],
      });
    }
    return r;
  }, [S, rango, months]);

  /* ---------------- temáticas ---------------- */
  const temas = useMemo(() => {
    const [a, b] = rango;
    const map = new Map();
    for (const [mIdx, tIdx, vol, clas, neg, pos] of S.themeMonth) {
      if (mIdx < a || mIdx > b) continue;
      const cur = map.get(tIdx) || { vol: 0, clas: 0, neg: 0, pos: 0 };
      cur.vol += vol; cur.clas += clas; cur.neg += neg; cur.pos += pos;
      map.set(tIdx, cur);
    }
    const arr = [...map.entries()].map(([tIdx, v]) => ({
      tema: DATA.themes[tIdx], ...v,
      negPct: v.clas > 0 ? (v.neg / v.clas) * 100 : null,
      posPct: v.clas > 0 ? (v.pos / v.clas) * 100 : null,
    }));
    const totalVol = arr.reduce((s, x) => s + x.vol, 0);
    const porVolumen = [...arr].sort((x, y) => y.vol - x.vol).slice(0, 10);
    const minClas = Math.max(20, totalVol * 0.005);
    const porNegativo = arr
      .filter((x) => x.clas >= minClas && x.negPct != null)
      .sort((x, y) => y.negPct - x.negPct)
      .slice(0, 10);
    return { porVolumen, porNegativo, totalVol };
  }, [S, rango]);

  const ultimoMesEnRango = rango[1] === months.length - 1;

  return (
    <div className="ec-root">
      <style>{CSS}</style>

      <div className="ec-wrap">
        {/* ---------------- encabezado ---------------- */}
        <header className="ec-head">
          <div className="ec-eyebrow">Municipalidad de Rosario · MuniBot</div>
          <h1 className="ec-title">ESCUCHA CIUDADANA</h1>
          <p className="ec-sub">¿Qué expresan los ciudadanos sobre MuniBot y los servicios municipales?</p>
          <p className="ec-note">Las fuentes se muestran por separado porque representan tipos de interacción diferentes.</p>
        </header>

        {/* ---------------- filtros ---------------- */}
        <div className="ec-filters">
          <div className="ec-field">
            <label className="ec-label">Fuente</label>
            <div className="ec-seg" role="tablist" aria-label="Fuente de datos">
              {FUENTES.map((f) => (
                <button
                  key={f.k}
                  role="tab"
                  aria-selected={fuente === f.k}
                  className={"ec-segbtn" + (fuente === f.k ? " on" : "")}
                  onClick={() => setFuente(f.k)}
                >
                  {f.n}
                </button>
              ))}
            </div>
          </div>

          <div className="ec-field">
            <label className="ec-label" htmlFor="ec-periodo">Período</label>
            <div className="ec-rowsel">
              <select id="ec-periodo" className="ec-select" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                {PERIODOS.map((p) => <option key={p.k} value={p.k}>{p.n}</option>)}
              </select>
              {periodo === "custom" && (
                <>
                  <select className="ec-select ec-select-sm" value={desde} onChange={(e) => setDesde(e.target.value)} aria-label="Desde">
                    {months.map((m) => <option key={m} value={m}>{mesLabel(m)}</option>)}
                  </select>
                  <span className="ec-arrow">→</span>
                  <select className="ec-select ec-select-sm" value={hasta} onChange={(e) => setHasta(e.target.value)} aria-label="Hasta">
                    {months.map((m) => <option key={m} value={m}>{mesLabel(m)}</option>)}
                  </select>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ---------------- nota metodológica ---------------- */}
        <div className="ec-metodo">
          <span className="ec-metodo-t">{nota.titulo}:</span>{" "}
          <span className="ec-metodo-x">{nota.texto}</span>
        </div>

        {/* ---------------- KPIs ---------------- */}
        <section className="ec-kpis">
          <Kpi
            label={fuente === "privada" ? "Volumen estimado" : nota.titulo === "Encuesta" ? "Comentarios de encuesta" : "Comentarios públicos"}
            valor={n0(agg.total)}
            pie={
              S.isSample
                ? `Estimado por ponderación sobre una muestra de ${n0(agg.filas)} mensajes.`
                : "Registros completos de la exportación."
            }
          />
          <Kpi
            label="Analizable para sentimiento"
            valor={pc((agg.analizable / agg.total) * 100)}
            pie="El resto son saludos, controles, adjuntos o textos sin opinión."
            extra={`${n0(agg.analizable)} de ${n0(agg.total)}`}
          />
          <Kpi
            label="Temática identificada"
            valor={pc((agg.conTema / agg.total) * 100)}
            pie="Detectada en el texto o inferida mediante el contexto del caso."
            extra={`${n0(agg.conTema)} registros`}
          />
          <Kpi
            label="Con señal de frustración"
            valor={pc((agg.frustracion / Math.max(1, agg.analizable)) * 100)}
            pie="Insistencia, reiteración o enojo explícito dentro de los textos analizables."
            extra={`${n0(agg.frustracion)} registros`}
          />
        </section>

        {/* ---------------- distribución del tono ---------------- */}
        <section className="ec-card">
          <h2 className="ec-h2">Distribución del tono</h2>
          <p className="ec-cap">Sobre los registros analizables del período seleccionado.</p>

          <div className="ec-legend">
            {TONES.map((t) => (
              <span key={t} className="ec-leg">
                <i className="ec-dot" style={{ background: TONE[t].c }} />
                {t}
                <b className="ec-legv">{pc((agg.tono[t] / Math.max(1, agg.analizables)) * 100)}</b>
              </span>
            ))}
          </div>

          <div className="ec-stack" role="img"
            aria-label={TONES.map((t) => `${t} ${pc((agg.tono[t] / Math.max(1, agg.analizables)) * 100)}`).join(", ")}>
            {TONES.map((t) => {
              const p = (agg.tono[t] / Math.max(1, agg.analizables)) * 100;
              if (p <= 0) return null;
              return (
                <div key={t} className="ec-seg-bar" style={{ width: p + "%", background: TONE[t].c }} title={`${t}: ${pc(p)}`}>
                  {p >= 7 && <span style={{ color: "#0B0E12" }}>{pc(p)}</span>}
                </div>
              );
            })}
          </div>
          <div className="ec-stackfoot">
            <span>{n0(agg.analizables)} registros analizables</span>
            <span>100%</span>
          </div>
        </section>

        {/* ---------------- evolución mensual ---------------- */}
        <section className="ec-card">
          <h2 className="ec-h2">Evolución mensual del tono</h2>
          <p className="ec-cap">
            Volumen de registros analizables según el período seleccionado.
            {ultimoMesEnRango && " El último mes está incompleto: el corte de datos es el 21/08/2026."}
          </p>
          <div className="ec-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={serie} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
                <CartesianGrid stroke={C.border} vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: C.dim, fontSize: 12, fontFamily: "Raleway" }}
                  tickLine={false} axisLine={{ stroke: C.borderHi }} minTickGap={18} />
                <YAxis tick={{ fill: C.dim, fontSize: 12, fontFamily: "Raleway" }}
                  tickLine={false} axisLine={false} width={56}
                  tickFormatter={(v) => (v >= 1000 ? n0(v / 1000) + "k" : n0(v))} />
                <Tooltip content={<TipTono />} cursor={{ stroke: C.borderHi }} />
                {TONES.map((t) => (
                  <Line key={t} type="monotone" dataKey={t} stroke={TONE[t].c}
                    strokeWidth={2} strokeDasharray={TONE[t].dash || undefined}
                    dot={{ r: 2.5, fill: TONE[t].c, strokeWidth: 0 }} activeDot={{ r: 4 }} isAnimationActive={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ---------------- temáticas ---------------- */}
        <section className="ec-two">
          <div className="ec-card">
            <h2 className="ec-h2">Temáticas principales</h2>
            <p className="ec-cap">Se excluyen los registros sin temática identificada.</p>
            <BarList
              items={temas.porVolumen.map((t) => ({ label: t.tema, value: t.vol, fmt: n0(t.vol) }))}
              color={C.accent}
            />
          </div>

          <div className="ec-card">
            <h2 className="ec-h2">Porcentaje negativo por temática</h2>
            <p className="ec-cap">Sólo resultados clasificados; se excluye “Incierto”.</p>
            <BarList
              items={temas.porNegativo.map((t) => ({ label: t.tema, value: t.negPct, fmt: pc(t.negPct) }))}
              color={TONE.Negativo.c}
              max={100}
            />
          </div>
        </section>

        {/* ---------------- comentarios ---------------- */}
        <Comentarios fuente={fuente} rango={rango} months={months} />

        <footer className="ec-foot">
          Fuente: exportación Metabase «Escucha ciudadana» — 142.577 registros procesados,
          corte 21/08/2026. Textos anonimizados. Clasificación de tono asistida por modelo automático
          (pysentimiento/robertuito) con revisión de reglas; puede contener errores en textos breves o irónicos.
        </footer>
      </div>
    </div>
  );
}

/* ============================ piezas ============================ */
function Kpi({ label, valor, pie, extra }) {
  return (
    <div className="ec-card ec-kpi">
      <div className="ec-kpi-l">{label}</div>
      <div className="ec-kpi-v">{valor}</div>
      {extra && <div className="ec-kpi-e">{extra}</div>}
      <div className="ec-kpi-p">{pie}</div>
    </div>
  );
}

function BarList({ items, color, max }) {
  const top = max || Math.max(...items.map((i) => i.value), 1);
  if (!items.length) return <p className="ec-empty">No hay datos para el período seleccionado.</p>;
  return (
    <div className="ec-bars">
      {items.map((it) => (
        <div className="ec-bar-row" key={it.label}>
          <div className="ec-bar-lab" title={it.label}>{it.label}</div>
          <div className="ec-bar-track">
            <div className="ec-bar-fill" style={{ width: Math.max(1.5, (it.value / top) * 100) + "%", background: color }} />
          </div>
          <div className="ec-bar-val">{it.fmt}</div>
        </div>
      ))}
    </div>
  );
}

function TipTono({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="ec-tip">
      <div className="ec-tip-h">{label}</div>
      {payload.map((p) => (
        <div className="ec-tip-r" key={p.dataKey}>
          <i className="ec-dot" style={{ background: p.color }} />
          <span>{p.dataKey}</span>
          <b>{n0(p.value)}</b>
          <em>{pc((p.value / Math.max(1, total)) * 100, 0)}</em>
        </div>
      ))}
    </div>
  );
}

/* --------------------------- tabla --------------------------- */
function Comentarios({ fuente, rango, months }) {
  const [tono, setTono] = useState("Todos");
  const [q, setQ] = useState("");
  const [tema, setTema] = useState("Todas");
  const [pag, setPag] = useState(0);
  const porPag = 12;

  const desde = months[rango[0]], hasta = months[rango[1]];

  const filtrados = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return DATA.comments.filter(([src, fecha, , tn, tm, txt]) => {
      if (src !== fuente) return false;
      const m = fecha.slice(0, 7);
      if (m < desde || m > hasta) return false;
      if (tono !== "Todos" && tn !== tono) return false;
      if (tema !== "Todas" && tm !== tema) return false;
      if (qq && !txt.toLowerCase().includes(qq)) return false;
      return true;
    });
  }, [fuente, tono, tema, q, desde, hasta]);

  const temasDisp = useMemo(() => {
    const s = new Set(DATA.comments.filter((c) => c[0] === fuente).map((c) => c[4]));
    return ["Todas", ...[...s].sort()];
  }, [fuente]);

  const p = Math.min(pag, Math.max(0, Math.ceil(filtrados.length / porPag) - 1));
  const vista = filtrados.slice(p * porPag, p * porPag + porPag);
  const conteo = (t) => DATA.comments.filter((c) => c[0] === fuente && (t === "Todos" || c[3] === t) &&
    c[1].slice(0, 7) >= desde && c[1].slice(0, 7) <= hasta).length;

  return (
    <section className="ec-card">
      <h2 className="ec-h2">Comentarios anonimizados</h2>
      <p className="ec-cap">
        Muestra de textos ciudadanos con su clasificación. Los datos personales fueron reemplazados por
        etiquetas genéricas antes del análisis.
      </p>

      <div className="ec-tabs" role="tablist" aria-label="Filtrar por sentimiento">
        {["Todos", ...TONES].map((t) => (
          <button key={t} role="tab" aria-selected={tono === t}
            className={"ec-tab" + (tono === t ? " on" : "")}
            style={tono === t && t !== "Todos" ? { borderColor: TONE[t].c, color: TONE[t].c } : undefined}
            onClick={() => { setTono(t); setPag(0); }}>
            {t !== "Todos" && <i className="ec-dot" style={{ background: TONE[t].c }} />}
            {t}
            <span className="ec-tabn">{conteo(t)}</span>
          </button>
        ))}
      </div>

      <div className="ec-tablebar">
        <input className="ec-input" placeholder="Buscar en los comentarios…" value={q}
          onChange={(e) => { setQ(e.target.value); setPag(0); }} aria-label="Buscar en los comentarios" />
        <select className="ec-select ec-select-sm" value={tema}
          onChange={(e) => { setTema(e.target.value); setPag(0); }} aria-label="Filtrar por temática">
          {temasDisp.map((t) => <option key={t} value={t}>{t === "Todas" ? "Todas las temáticas" : t}</option>)}
        </select>
      </div>

      {vista.length === 0 ? (
        <p className="ec-empty">Ningún comentario coincide con estos filtros. Probá quitar la búsqueda o ampliar el período.</p>
      ) : (
        <div className="ec-tablewrap">
          <table className="ec-table">
            <thead>
              <tr>
                <th style={{ width: 84 }}>Fecha</th>
                <th style={{ width: 150 }}>Canal</th>
                <th>Comentario</th>
                <th style={{ width: 170 }}>Temática</th>
                <th style={{ width: 110 }}>Tono</th>
              </tr>
            </thead>
            <tbody>
              {vista.map((c, i) => (
                <tr key={p + "-" + i}>
                  <td className="ec-td-dim">{fechaLabel(c[1])}</td>
                  <td className="ec-td-dim">{c[2]}</td>
                  <td>{c[5]}</td>
                  <td className="ec-td-dim">{c[4]}</td>
                  <td>
                    <span className="ec-chip" style={{ color: TONE[c[3]].c, borderColor: TONE[c[3]].c + "55" }}>
                      <i className="ec-dot" style={{ background: TONE[c[3]].c }} />{c[3]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="ec-pag">
        <span>{filtrados.length === 0 ? "0 comentarios" : `${p * porPag + 1}–${Math.min(filtrados.length, (p + 1) * porPag)} de ${filtrados.length} comentarios`}</span>
        <div>
          <button className="ec-pbtn" onClick={() => setPag(Math.max(0, p - 1))} disabled={p === 0}>Anterior</button>
          <button className="ec-pbtn" onClick={() => setPag(p + 1)}
            disabled={(p + 1) * porPag >= filtrados.length}>Siguiente</button>
        </div>
      </div>
    </section>
  );
}

/* ============================== CSS ============================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap');

.ec-root{background:${C.bg};color:${C.text};font-family:Raleway,"Segoe UI",system-ui,sans-serif;
  min-height:100vh;font-weight:400;-webkit-font-smoothing:antialiased;}
.ec-root *{box-sizing:border-box;}
.ec-wrap{max-width:1240px;margin:0 auto;padding:48px 24px 64px;}

.ec-head{margin-bottom:32px;}
.ec-eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${C.dimmer};font-weight:500;margin-bottom:16px;}
.ec-title{font-size:40px;font-weight:700;letter-spacing:-.01em;color:${C.accent};margin:0 0 8px;line-height:1.1;}
.ec-sub{font-size:19px;font-weight:300;color:${C.text};margin:0 0 6px;line-height:1.4;}
.ec-note{font-size:14px;font-weight:300;color:${C.dimmer};margin:0;}

.ec-filters{display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;margin-bottom:24px;}
.ec-field{display:flex;flex-direction:column;gap:8px;}
.ec-label{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${C.dim};font-weight:500;}
.ec-seg{display:flex;background:${C.surface};border:1px solid ${C.border};border-radius:8px;padding:4px;gap:4px;flex-wrap:wrap;}
.ec-segbtn{font-family:inherit;font-size:14px;font-weight:400;color:${C.dim};background:transparent;border:0;
  padding:8px 16px;border-radius:6px;cursor:pointer;transition:background .15s,color .15s;}
.ec-segbtn:hover{color:${C.text};background:${C.surfaceHi};}
.ec-segbtn.on{background:${C.accent};color:#04121F;font-weight:500;}
.ec-rowsel{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.ec-select{font-family:inherit;font-size:14px;font-weight:400;color:${C.text};background:${C.surface};
  border:1px solid ${C.border};border-radius:8px;padding:10px 14px;min-width:190px;cursor:pointer;}
.ec-select-sm{min-width:130px;}
.ec-select:focus-visible,.ec-input:focus-visible,.ec-segbtn:focus-visible,.ec-tab:focus-visible,.ec-pbtn:focus-visible{
  outline:2px solid ${C.accent};outline-offset:2px;}
.ec-arrow{color:${C.dimmer};font-size:14px;}

.ec-metodo{background:${C.surface};border:1px solid ${C.border};border-left:3px solid ${C.accent};
  border-radius:8px;padding:16px 20px;font-size:14px;line-height:1.6;margin-bottom:32px;}
.ec-metodo-t{font-weight:600;color:${C.text};}
.ec-metodo-x{font-weight:300;color:${C.dim};}

.ec-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px;}
.ec-card{background:${C.surface};border:1px solid ${C.border};border-radius:12px;padding:24px;margin-bottom:16px;}
.ec-kpi{margin-bottom:0;display:flex;flex-direction:column;}
.ec-kpi-l{font-size:13px;font-weight:400;color:${C.dim};margin-bottom:10px;}
.ec-kpi-v{font-size:36px;font-weight:700;letter-spacing:-.02em;line-height:1;margin-bottom:8px;}
.ec-kpi-e{font-size:12px;font-weight:400;color:${C.accent};margin-bottom:8px;}
.ec-kpi-p{font-size:12px;font-weight:300;color:${C.dimmer};line-height:1.5;margin-top:auto;}

.ec-h2{font-size:20px;font-weight:600;margin:0 0 4px;letter-spacing:-.01em;}
.ec-cap{font-size:13px;font-weight:300;color:${C.dimmer};margin:0 0 20px;line-height:1.5;}

.ec-legend{display:flex;flex-wrap:wrap;gap:20px;margin-bottom:14px;}
.ec-leg{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:400;color:${C.dim};}
.ec-legv{color:${C.text};font-weight:600;}
.ec-dot{width:9px;height:9px;border-radius:50%;display:inline-block;flex:none;}
.ec-stack{display:flex;height:52px;border-radius:6px;overflow:hidden;}
.ec-seg-bar{display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:500;
  transition:width .35s ease;min-width:2px;}
.ec-stackfoot{display:flex;justify-content:space-between;font-size:12px;font-weight:300;color:${C.dimmer};margin-top:10px;}

.ec-chart{height:320px;width:100%;}

.ec-two{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.ec-two .ec-card{margin-bottom:16px;}

.ec-bars{display:flex;flex-direction:column;gap:11px;}
.ec-bar-row{display:grid;grid-template-columns:150px 1fr 64px;align-items:center;gap:12px;}
.ec-bar-lab{font-size:13px;font-weight:300;color:${C.dim};text-align:right;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis;}
.ec-bar-track{background:${C.surfaceHi};border-radius:3px;height:20px;overflow:hidden;}
.ec-bar-fill{height:100%;border-radius:3px;transition:width .35s ease;}
.ec-bar-val{font-size:13px;font-weight:500;color:${C.text};text-align:right;font-variant-numeric:tabular-nums;}

.ec-tip{background:#0A0D11;border:1px solid ${C.borderHi};border-radius:8px;padding:12px 14px;font-size:12px;
  box-shadow:0 6px 24px rgba(0,0,0,.6);}
.ec-tip-h{font-weight:600;font-size:13px;margin-bottom:8px;color:${C.text};}
.ec-tip-r{display:grid;grid-template-columns:10px 74px 60px 44px;align-items:center;gap:8px;padding:2px 0;color:${C.dim};font-weight:300;}
.ec-tip-r b{color:${C.text};font-weight:600;text-align:right;font-variant-numeric:tabular-nums;}
.ec-tip-r em{font-style:normal;color:${C.dimmer};text-align:right;}

.ec-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
.ec-tab{display:flex;align-items:center;gap:7px;font-family:inherit;font-size:13px;font-weight:400;
  color:${C.dim};background:${C.surfaceHi};border:1px solid ${C.border};border-radius:999px;
  padding:8px 14px;cursor:pointer;transition:border-color .15s,color .15s;}
.ec-tab:hover{color:${C.text};border-color:${C.borderHi};}
.ec-tab.on{color:${C.text};border-color:${C.accent};background:#0F151C;}
.ec-tabn{font-size:11px;color:${C.dimmer};font-variant-numeric:tabular-nums;}

.ec-tablebar{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
.ec-input{flex:1;min-width:220px;font-family:inherit;font-size:14px;font-weight:300;color:${C.text};
  background:${C.surfaceHi};border:1px solid ${C.border};border-radius:8px;padding:10px 14px;}
.ec-input::placeholder{color:${C.dimmer};}

.ec-tablewrap{overflow-x:auto;border:1px solid ${C.border};border-radius:8px;}
.ec-table{width:100%;border-collapse:collapse;font-size:13px;min-width:820px;}
.ec-table th{text-align:left;font-weight:500;font-size:11px;letter-spacing:.08em;text-transform:uppercase;
  color:${C.dimmer};padding:12px 14px;border-bottom:1px solid ${C.border};background:#0A0D11;white-space:nowrap;}
.ec-table td{padding:13px 14px;border-bottom:1px solid ${C.border};vertical-align:top;line-height:1.55;font-weight:300;color:${C.text};}
.ec-table tr:last-child td{border-bottom:0;}
.ec-table tbody tr:hover{background:${C.surfaceHi};}
.ec-td-dim{color:${C.dim} !important;font-weight:300;white-space:nowrap;}
.ec-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid;border-radius:999px;
  padding:3px 10px;font-size:12px;font-weight:500;white-space:nowrap;}

.ec-pag{display:flex;justify-content:space-between;align-items:center;margin-top:16px;
  font-size:12px;font-weight:300;color:${C.dimmer};gap:12px;flex-wrap:wrap;}
.ec-pbtn{font-family:inherit;font-size:13px;font-weight:400;color:${C.text};background:${C.surfaceHi};
  border:1px solid ${C.border};border-radius:6px;padding:7px 14px;margin-left:8px;cursor:pointer;}
.ec-pbtn:hover:not(:disabled){border-color:${C.borderHi};}
.ec-pbtn:disabled{opacity:.35;cursor:not-allowed;}

.ec-empty{font-size:14px;font-weight:300;color:${C.dimmer};padding:28px 0;text-align:center;}
.ec-foot{font-size:12px;font-weight:300;color:${C.dimmer};line-height:1.6;margin-top:32px;
  padding-top:24px;border-top:1px solid ${C.border};}

@media (max-width:1000px){
  .ec-kpis{grid-template-columns:repeat(2,1fr);}
  .ec-two{grid-template-columns:1fr;}
}
@media (max-width:640px){
  .ec-wrap{padding:32px 16px 48px;}
  .ec-title{font-size:30px;}
  .ec-sub{font-size:17px;}
  .ec-kpis{grid-template-columns:1fr;}
  .ec-seg{width:100%;}
  .ec-segbtn{flex:1;padding:8px 10px;font-size:13px;}
  .ec-select{min-width:0;width:100%;}
  .ec-field{width:100%;}
  .ec-bar-row{grid-template-columns:112px 1fr 56px;gap:8px;}
  .ec-bar-lab{font-size:12px;}
  .ec-chart{height:260px;}
}
@media (prefers-reduced-motion:reduce){
  .ec-seg-bar,.ec-bar-fill{transition:none;}
}
`;
