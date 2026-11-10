import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { OrgChart } from 'd3-org-chart';
import user from '../../../img/user.png';

export const OrgChartComponent = (props, ref) => {
  const d3Container = useRef(null);
  let chart = null;

  function addNode(node) {
    chart.addNode(node);
  }

  props.setClick(addNode);

  // We need to manipulate DOM
  useLayoutEffect(() => {
    if (props.data && d3Container.current) {
      if (!chart) {
        chart = new OrgChart();
      }
      chart
        .container(d3Container.current)
        .data(props.data)
        .nodeHeight((d) => 85)
        .nodeWidth((d) => {
            return 220;
        }) 
        .onNodeClick((d, i, arr) => {

        })
        .nodeContent(function (d, i, arr, state) {
            const color = '#FFFFFF';
            let imagenUrl = '';
            let imageFit = 'cover';
            
    
            if(d.data.imageUrl.length < 1){
                imagenUrl = user
            }else{
                imagenUrl = 'data:image/png;base64, ' + d.data.imageUrl
            }

            if(d.data.name == 'ESCORIAL'  || d.data.name == 'SIN ASIGNAR'  || d.data.name == 'GERENTE INDUSTRIAL (VACANTE)'){
                imageFit = 'contain'
            }

            return `
            <div style="font-family: 'Inter', sans-serif;background-color:${color}; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width}px;height:${d.height}px;border-radius:10px;border: 1px solid #aeaeae">
            <div style="background-color:${color};position:absolute;margin-top:-25px;margin-left:${15}px;border-radius:100px;width:50px;height:50px;" ></div>
            
            <img src=" ${ imagenUrl } " style="position:absolute;margin-top:-20px;margin-left:${20}px;border-radius:100px;width:40px;height:40px;object-fit: ${imageFit};" />
            
            <div class="organigrama-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 1024 1024" class="icon" version="1.1"><path d="M388.9 597.4c-135.2 0-245.3-110-245.3-245.3s110-245.3 245.3-245.3 245.3 110 245.3 245.3-110.1 245.3-245.3 245.3z m0-405.3c-88.2 0-160 71.8-160 160s71.8 160 160 160 160-71.8 160-160-71.8-160-160-160z" fill="#5F6379"/><path d="M591.3 981.3H186.5c-76.6 0-138.8-62.3-138.8-138.8V749c0-130.6 106.2-236.9 236.9-236.9h208.8c130.6 0 236.9 106.3 236.9 236.9v93.5c-0.2 76.5-62.4 138.8-139 138.8zM284.5 597.4c-83.6 0-151.5 68-151.5 151.5v93.5c0 29.5 24 53.5 53.5 53.5h404.8c29.5 0 53.5-24 53.5-53.5v-93.5c0-83.6-68-151.5-151.6-151.5H284.5z" fill="#5F6379"/><path d="M847.2 938.6c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7c29.5 0 53.5-24 53.5-53.5v-93.5c0-83.6-68-151.5-151.6-151.5h-14.3c-19.8 0-37-13.6-41.5-32.9-4.5-19.3 4.8-39.1 22.5-48 54.8-27.3 88.9-82.1 88.9-143.1 0-88.2-71.8-160-160-160-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7c135.2 0 245.3 110 245.3 245.3 0 57.8-19.9 111.9-54.9 154.8 88.3 34.6 151 120.6 151 220.9v93.5c0 76.6-62.3 138.8-138.9 138.8z" fill="#5F6379"/></svg>
              <div class="organigrama-cant-sub">${d.data.cantidad_subordinados}</div>
            </div>
            
            <div style="font-size:15px;color:#08011E;margin-left:20px;margin-top:32px"> ${
                d.data.name
            } </div>
            <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;margin-bottom:5px;"> ${
                d.data.positionName
            } </div>
            
        </div>
        `;
        })
        .render();


    }
  });

  return (
    <div>
      <div ref={d3Container} />
    </div>
  );
};