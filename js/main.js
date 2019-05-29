
$(document).ready(function() {
    // Set up attendance graph
    $.get('https://raw.githubusercontent.com/jamestombs/parkrunstats/master/allStats.json', function(data) {
        const attendance = $("#attendance").donutty({
            min: 0,
            max: data.Attendance.highestAttendance,
            value: data.lastWeekendAttendance,
            circle: false,
            round: false,
            radius: 100,
            thickness: 30
        });

        // Update table
        $('span[data-type="highestAttendenceDate"]').html(data.Attendance.highestAttendanceDate.dayOfMonth +'/'+ data.Attendance.highestAttendanceDate.monthValue +'/'+ data.Attendance.highestAttendanceDate.year);
        $('span[data-type="highestAttendence"]').html(data.Attendance.highestAttendance);
        $('span[data-type="lastWeekendDate"]').html(data.Attendance.lastWeekendDate.dayOfMonth +'/'+ data.Attendance.lastWeekendDate.monthValue +'/'+ data.Attendance.lastWeekendDate.year);
        $('span[data-type="lastWeekendAttendence"]').html(data.Attendance.lastWeekendAttendance);
        $('span[data-type="year"]').html(data.Attendance.year);
        $('span[data-type="yearlyAverage"]').html(data.Attendance.yearlyAverage);

        update_stat_blocks(data.RunStatsLast);

        update_milestones(data.Milestoners);

        update_gender_stats(data.GenderStatsLast);
    }, 'json');

    // Update run stats and set height for blocks
    function update_stat_blocks(data) {
        // total runners
        $('.run-stat[data-type="totalrunners"] span').append(data.runsCompleted);
        // Volunteers
        $('.run-stat[data-type="volunteersengaged"] span').append(data.volunteersEngaged);
        // Vol slots
        $('.run-stat[data-type="volunteerslots"] span').append(data.volunteerSlots);
        // PBs
        $('.run-stat[data-type="pbs"] span').append(data.pbs);
        // Tourists
        $('.run-stat[data-type="tourists"] span').append(data.newTourists);
        // Newbies
        $('.run-stat[data-type="newbies"] span').append(data.newbies);

        var statblockheight = 0;
        $('.run-stat').each(function() {
            var type = $(this).data('type');
            var item = data[type];
            $(this).find('span').html(item);
            var thisheight = $(this).find('h3').height();
            if (thisheight > statblockheight) {
                statblockheight = thisheight;
            }
        });
        $('.run-stat h3').height(statblockheight);
    }

    function getDummyData(starter) {
        return [
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1),
            Math.round((Math.random() * starter) + 1)
        ];
    }

    // Age/grade breakdown
    var ctx = document.getElementById("agebreakdown").getContext("2d");
    var data = {
        labels: ['Junior (10)', 'Junior (11-14)', 'Junior (15-17)', 'Senior 18-19', 'Senior (20-24)', 'Senior (25-29)', 'Senior (30-34)', 'Senior (35-39)', 'Senior (40-44)', 'Senior (45-49)', 'Senior (50-54)', 'Senior (54-59)', 'Senior (60-64)', 'Senior (65-69)', 'Senior (70-74)', 'Senior (75-79)', 'Senior (80-84)', 'Senior (85-89)'],
        datasets: [
            {
                label: 'Female Runners',
                backgroundColor: '#8080ff',
                stack: 'Runners',
                data: getDummyData(250)
            },
            {
                label: 'Male Runners',
                backgroundColor: '#09f',
                stack: 'Runners',
                data: getDummyData(300)
            },
            {
                label: 'Female Volunteers',
                backgroundColor: '#ccf',
                stack: 'Volunteers',
                data: getDummyData(15)
            },
            {
                label: 'Male Volunteers',
                backgroundColor: '#80ccff',
                stack: 'Volunteers',
                data: getDummyData(10)
            }
        ]
    };
    var stackedBar = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    min: 0
                }]
            }
        }
    });

    function update_milestones(data) {
        if (data.milestones.length > 0) {
            var $table = $('<table></table>').addClass('table table-striped').append($('<thead><tr><th>Name</th><th>Milestone</th></tr></thead>'));
            var $tbody = $('<tbody></tbody');
            for (var i = 0; i < data.milestones.length; i++) {
                var $tshirt = get_shirt(data.milestones[i].milestone);
                var $row = $('<tr></tr>').append($('<td></td>').html(data.milestones[i].name)).append($('<td></td>').html($tshirt));
                $tbody.append($row);
            }
            $table.append($tbody);
            $("#milestones").append($table);
        }
    }

    function get_shirt(milestone) {
        var layerclass = 'fa-layers-text';
        if (milestone > 10) {
            layerclass += ' fa-inverse';
        }
        var $wrapper = $('<span></span>').addClass('fa-layers fa-fw milestone-'+ milestone).append($('<i></i>').addClass('fas fa-tshirt fa-2x')).append($('<span></span>').html(milestone).addClass(layerclass).attr('data-fa-transform', 'shrink-3 right-9'));
        return $wrapper;
    }

    function update_gender_stats(data) {
        $('td[data-type="malerunners"]').html(format_num_percentage(data.maleRunners, data.maleRunnerPercentage));
        $('td[data-type="femalerunners"]').html(format_num_percentage(data.femaleRunners, data.femaleRunnerPercentage));
        $('td[data-type="malevols"]').html(format_num_percentage(data.maleVolunteers, data.maleVolunteersPercentage));
        $('td[data-type="femalevols"]').html(format_num_percentage(data.femaleVolunteers, data.femaleVolunteersPercentage));
    }

    function format_num_percentage(num, per) {
        return num +' ('+ Math.round(per * 100) +'%)';
    }
});
