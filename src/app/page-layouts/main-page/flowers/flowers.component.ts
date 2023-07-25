import { Component, OnInit } from '@angular/core';
import { IFlower } from './flower.module';

@Component({
  selector: 'app-flowers',
  templateUrl: './flowers.component.html',
  styleUrls: ['./flowers.component.css']
})
export class FlowersComponent implements OnInit {
  flowers: IFlower[] = [
    new IFlower('Eustoma', 'hey are herbaceous annuals, growing to 15–60 cm tall, with bluish green, slightly succulent leaves and large funnel-shaped flowers growing on long straight stems: sometimes erect single stems, other times branching stems.', '../../../../assets/img/eustoma.jpg', 22),
    new IFlower('Alstroemeria', 'Alstroemeria aurea, commonly called Peruvian lily, is a tuberous perennial native to South America. Terminal clusters of small, lily-like flowers top slender, upright stems growing in bushy clumps to 2-3 tall. Flowers in yellow or orange, often with spotting and streaking. Blooms in summer.','../../../../assets/img/Alstroemeria_aurantiaca.jpg', 15),
    new IFlower('Roses', '    Their stems are usually prickly and their glossy, green leaves have toothed edges. Rose flowers vary in size and shape. They burst with colours ranging from pastel pink, peach, and cream, to vibrant yellow, orange, and red. Many roses are fragrant, and some produce berry-like fruits called hips.', '../../../../assets/img/the-meaning-of-red-roses002.jpg', 25)
    
  ]
  constructor(){}

  ngOnInit() {
    
  }
}
