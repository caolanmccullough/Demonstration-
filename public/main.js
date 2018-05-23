//create variable called form 
const form = document.getElementById('votingForm');

//Form - Submitting Event 
form.addEventListener('submit', (e) => {
	//create option variable
	//use querySelector to grab input that has name = to answer
	const option = document.querySelector('input[name=answer]:checked').value;
	//create variable called data which is an object that has answer = option
	const data = {answer: option};

	//To send post request use fetch 
	fetch('http://localhost:3015/poll', {
		method: 'post',
		//send body which will contain the data
		body: JSON.stringify(data),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})
	//returns a promise
	//map it to the json
	.then(res =>res.json())
	.then(data => console.log(data))
	.catch(err=> console.log(err));

	//prevent default behaviour  
	e.preventDefault();
});

//Fetch will hit the get request as fetch above hits post request
fetch('http://localhost:3015/poll')
//takes result and turns it to json
.then(res => res.json())
//gets data
.then(data => {
	//logs results of the whole poll
	console.log(data);
	const votes = data.votes; 
	//gets the total number of votes
	const totalVotes = votes.length;
    document.querySelector('#pieChartTitle').textContent = `Total Votes: ${totalVotes}`;

    // Refresh the Total number of votes of the poll every second. 
    setInterval(() => {
      fetch('http://localhost:3015/poll')
        .then(res => res.json())
        .then(data => document.querySelector('#pieChartTitle').textContent = `Total number of votes: ${data.votes.length}`)
        .catch(err => console.log(err));
    }, 1000);



	//Count vote points - best way found to do this is use the reduce high array function
	// takes in acculumator and current value 
	// Stack overflow best solution
			const voteCounts = votes.reduce((acc, vote) => ((acc[vote.answer] = 
			(acc[vote.answer] || 0) + parseInt(vote.points)), acc), {});

//create votePoints
let dataPoints = [
{label: 'Yes', y: voteCounts.Yes},
{label: 'No', y:voteCounts.No},
{label: 'Unsure', y:voteCounts.Unsure}
];

//Create variable named pieChartContainer 
const pieChartContainer = document.querySelector('#pieChartContainer');

if(pieChartContainer){
	var pieChart = new CanvasJS.Chart('pieChartContainer', {
		//chart will update as animation set to true
		animationEnabled: true,
			theme: 'theme1',
			data: [
			{
				//set chart type to pie chart
				type: 'pie',
				//set datapoints to votePoints variable 
				dataPoints: dataPoints
			}
			]
		});
	//Renders pie chart to div with id pieChartContainer 
		pieChart.render();

		//Initialise pusherPoll app
    var pusherPoll = new Pusher('a36a12270741efa5f9fb', {
      cluster: 'eu',
      encrypted: true
    });

    //suscribe to vote-poll and bind to answer-vote event
    var channel = pusherPoll.subscribe('vote-poll');
    channel.bind('answer-vote', function(data) {
    	//Add the data to our chart by taking the dataPoints array
      	dataPoints = dataPoints.map(x => {
      		//check if x.label is equal to data.answer 
      		if(x.label == data.answer) {
      			// using the y value in dataPoints append data.points which has a value of 1
      			x.y += data.points;
      			return x;
      		} else {
      			return x;
      		}
      	});
      	//Rerender the pie chart 
      	pieChart.render();
    });
	}

});

