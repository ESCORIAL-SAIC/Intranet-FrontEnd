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