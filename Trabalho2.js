new p5();
//==========================================
var list_vertex_polygon = [], big_list_polygon = []; //vertex of polygons
var list_vertex_radius = [], big_list_radius = []; //vertex of radius
var change_X = 0, change_Y = 0;
var signal_close_polygon = false;
var signal_adding_vertex = false;
var signal_close_radius = false;
var signal_change_vertex = false;
var signal_pressed = false;
var signal_pressed_2 = false;
var signal_pressed_3 = false;
var signal_radius = false;
var signal_polygon = true;
var clicked=false, clickTimeout=300;
let width = 600, height = 400;

//=============================================
function setup() {
  createCanvas(width, height);
 }
//=============================================

function mouseClicked() { //mouseClicked()
  /////////////////////////////////////////////////////
  if (mouseButton === LEFT){
    if(signal_polygon === true){
      //add a vertex in list_vertex_polygon
      list_vertex_polygon.push([mouseX, mouseY]);
      signal_close_polygon = false;
      signal_adding_vertex = true;

      if(!clicked){
      clicked=true;
      setTimeout(function(){
        if(clicked){
          console.log("single click");
          clicked=false;
          //single ClickStuff
        }
        },clickTimeout); //end setTimeout(function(){...}, clickTimeout)
      }
      else{
      clicked=false;
      console.log("double click");
      //double click Stuff
      signal_close_polygon = true;
      signal_adding_vertex = false;
      list_vertex_polygon.pop();
      add_list_p(list_vertex_polygon);
      list_vertex_polygon = [];
      }
    }
  }
}
function mousePressed(){
  if(signal_radius === true){
    if(mouseButton === LEFT){
      signal_pressed = true;
      signal_adding_vertex = true;
      list_vertex_radius.push(mouseX, mouseY);
    }
  }
  if(signal_change_vertex === true){
    if(mouseButton === LEFT && insideEllipse_in_polygons(mouseX, mouseY) === true){
      signal_pressed_2 = true;
    }
    if(mouseButton === LEFT && insideEllipse_in_radius(mouseX,mouseY) === true){
      signal_pressed_3 = true;
    }
  }
}
function mouseReleased(){
  if(signal_pressed === true){
    signal_pressed = false;
    signal_adding_vertex = false;
    list_vertex_radius.push(mouseX, mouseY);
    if(list_vertex_radius[0]===list_vertex_radius[2] && list_vertex_radius[1]===list_vertex_radius[3]){
      list_vertex_radius = [];
    }
    else{
      add_list_r(list_vertex_radius)
      list_vertex_radius = [];
    }
  }
  if(signal_pressed_2 === true){
    signal_pressed_2 = false;
    big_list_polygon[change_X][change_Y][0] = mouseX;
    big_list_polygon[change_X][change_Y][1] = mouseY;
    change_X, change_Y = 0;
  }
  if(signal_pressed_3 === true){
    signal_pressed_3 = false;
    let d_x = mouseX - big_list_radius[change_X][0];
    let d_y = mouseY - big_list_radius[change_X][1];
    big_list_radius[change_X][0] = mouseX;
    big_list_radius[change_X][1] = mouseY;
    big_list_radius[change_X][2] = big_list_radius[change_X][2] + d_x;
    big_list_radius[change_X][3] = big_list_radius[change_X][3] + d_y;
    change_X = 0;
  }
}

function draw_current_radius(){
  if(signal_adding_vertex === true){
    if (signal_pressed === true){
      let v0 = createVector(list_vertex_radius[0],list_vertex_radius[1]);
      let v1 = createVector(pmouseX -list_vertex_radius[0], pmouseY - list_vertex_radius[1]);
      drawArrow(v0, v1.mult(width), 'red');
      v1.normalize();
      drawArrow(v0, v1.mult(35), 'blue');
    }
  }
}
function draw_stored_radius(list = []){
  for (let i = 0; i < list.length; i++){
    let v0 = createVector(list[i][0], list[i][1]);
    let v1 = createVector(list[i][2] - list[i][0], list[i][3] - list[i][1]);
    drawArrow(v0, v1.mult(width), 'red');
    v1.normalize();
    drawArrow(v0, v1.mult(35), 'blue');
  }
}
function drawArrow(base, vec, myColor) {
  push();           // Start a new drawing state
  stroke(myColor);
  strokeWeight(1);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  ellipse(0,0,8,8);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();          // Restore original state
}

function draw_current_polygon(list = []){
  if (signal_adding_vertex === true){
    fill(200,200);
    beginShape();
      for(let i = 0; i < list.length; i++){
        let x = list[i][0];
        let y = list[i][1];
        vertex(x,y);
      }
      if(signal_close_polygon === true){ //
        endShape(CLOSE);
      }
      else{
        vertex(pmouseX,pmouseY);
        endShape(CLOSE);
      }
  }
}
function draw_stored_polygon(list = []){
  fill(200,150);
  for(let i = 0; i < list.length; i++){
  beginShape();
      for (let j = 0; j <list[i].length; j++){
        let x = list[i][j][0];
        let y = list[i][j][1];
        vertex(x,y);
      }
  endShape(CLOSE);
  }
}

function add_list_p(list = []) {
  big_list_polygon.push(list);
  return big_list_polygon;
}
function add_list_r(list = []) {
  big_list_radius.push(list);
  return big_list_radius;
}

function insideEllipse_in_polygons(x, y){
  let d = 0;
  for (let i = 0; i < big_list_polygon.length; i++){
    for (let j = 0; j < big_list_polygon[i].length; j++){
      d = int(dist(big_list_polygon[i][j][0], big_list_polygon[i][j][1], x, y));
      if(d <= 2.5){
        //console.log("dentro");
        change_X = i;
        change_Y = j;
        return true;
      }
    }
  }
  //console.log("fora");
  return false;
}
function draw_Ellipses_in_polygons(list = []){
  if(signal_change_vertex === true){
    for (let i = 0; i < list.length; i++){
      for (let j = 0; j < list[i].length; j ++){
        fill(0);
        ellipse(list[i][j][0], list[i][j][1], 5, 5);
      }
    }
  }
}
function insideEllipse_in_radius(x, y){
  let d = 0;
  let l = 0;
  for (let i = 0; i < big_list_radius.length; i++){
    d = int(dist(big_list_radius[i][0], big_list_radius[i][1], x, y));
    //l = int(dist(big_list_radius[i][2], big_list_radius[i][3], x, y));
    if(d <= 2.5){
      change_X = i;
      return true;
    }
    //
  }
}
function draw_Ellipses_in_radius(list = []){
  if(signal_change_vertex === true){
    for (let i = 0; i < list.length; i++){
      fill(0);
      let v0 = createVector(list[i][0], list[i][1]);
      let v1 = createVector(list[i][2] - list[i][0], list[i][3] - list[i][1]);
      ellipse(v0.x, v0.y, 5, 5);
      push();
      translate(v0.x, v0.y);
      v1.normalize();
      v1.mult(35);
      ellipse(v1.x, v1.y, 5, 5);
      pop();
    }
  }
}

function keyPressed(){
  if (keyCode === UP_ARROW){
    if(signal_polygon === true){
      signal_polygon = false;
      if (signal_adding_vertex === true){
        //////////////////////////////////////////
        //finish polygon if there any opened//////
        list_vertex_polygon.push([pmouseX, pmouseY]);
        signal_close_polygon = true;
        signal_adding_vertex = false;
        add_list_p(list_vertex_polygon);
        list_vertex_polygon = [];
        /////////////////////////////////////////
      }
    }
    signal_change_vertex = false;
    signal_radius = true;
  }
  if (keyCode === DOWN_ARROW){
    signal_polygon = true;
    signal_change_vertex = false;
    signal_radius = false;
  }
  if(keyCode === RIGHT_ARROW){
    signal_change_vertex = true;
    signal_polygon = false;
    signal_radius = false;
  }
  if(keyCode === LEFT_ARROW){
    //
  }
  if (keyCode === TAB){
    console.log(big_list_radius.length);
    for (var i = 0; i<big_list_radius.length; i++){
      console.log(big_list_radius[i]);
    }
  }
  if (keyCode === CONTROL){
    console.log(big_list_polygon.length);
    for (var i = 0; i<big_list_polygon.length; i++){
      console.log(big_list_polygon[i].slice());
    }
  }
}

function draw() {
  background(255);
  strokeWeight(1);
  // Draw polygons ==============================
  draw_current_polygon(list_vertex_polygon);
  draw_stored_polygon(big_list_polygon);
  // Draw radius   ==============================
  draw_current_radius();
  draw_stored_radius(big_list_radius);
  // Draw ellipses ==============================
  draw_Ellipses_in_polygons(big_list_polygon);
  draw_Ellipses_in_radius(big_list_radius);
  if(signal_pressed_2 === true){
      big_list_polygon[change_X][change_Y][0] = pmouseX;
      big_list_polygon[change_X][change_Y][1] = pmouseY;
  }
  if(signal_pressed_3 === true){
    let d_x = pmouseX - big_list_radius[change_X][0];
    let d_y = pmouseY - big_list_radius[change_X][1];
    big_list_radius[change_X][0] = pmouseX;
    big_list_radius[change_X][1] = pmouseY;
    big_list_radius[change_X][2] = big_list_radius[change_X][2] + d_x;
    big_list_radius[change_X][3] = big_list_radius[change_X][3] + d_y;
  }
  // Draw target ================================
  if (mouseIsPressed) {
    if (mouseButton === LEFT){
      noFill();
      strokeWeight(3);
      ellipse(mouseX, mouseY, 40, 40);
    }
    if (mouseButton === RIGHT){
      //
    }
  }

  //=============================================
  strokeWeight(3);
  noFill();
  rect(0, 0, 600, 400);
}
