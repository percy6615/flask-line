# -*- coding: utf-8 -*-
import json
import os
import random
from flask import render_template, request, send_from_directory, make_response, jsonify
from flask.views import MethodView
from werkzeug.utils import secure_filename

from app.database.mysql_engine import MySQLs

liffID = os.getenv('LIFF_BIND_ID')

class LiffControllerToolsBot(MethodView):
    def get(self):
        return render_template('toolsbot.html', param1=str(random.random()))

    def post(self):
        return 200


class LiffControllerUserReport(MethodView):
    def get(self):

        if request.args.get('liff.state') is not None:
            querystr = request.args['liff.state']
            missionId = querystr.split('mission_id=')
            if len(missionId) > 1:
                key = missionId[len(missionId) - 1]
            return render_template('reportpage.html', mission_id=key)
        else:
            key = request.args['mission_id']
            return render_template('reportpage.html', mission_id=key)

    def post(self):
        return 200


class LiffPublicPathController(MethodView):
    def get(self, path):
        # return {"success":path}
        return self.send_static_content(path)

    def send_static_content(self, path):
        return send_from_directory('public', path)


class LiffGetQueryPostSaveMissionController(MethodView):

    def get(self):
        missionID = request.args.get('mission_id')
        rows = MySQLs().get_dict_data_sql(
            "SELECT * FROM wraproject.pump_mission_list WHERE mission_id='" + missionID + "'")
        if rows is not None and len(rows) > 0:
            row = rows[0]
            carlist = []
            dispatchUnit = row['dispatch_unit']
            cars = MySQLs().get_dict_data_sql("SELECT * FROM wraproject.pump_car WHERE unit= '" + dispatchUnit + "'")
            for car in cars:
                carlist.append(car['car_name'])
            row['carlist'] = carlist
            create_time_str = row['create_time'].strftime('%Y/%m/%d %H:%M')
            row['create_time'] = create_time_str
            row_str = str(row).encode('utf8').decode('utf8').replace("'", '"')
            return json.loads(row_str)
        else:
            response = make_response('查無此筆任務')
            response.status_code = 200
            return response

    def post(self):
        post_data = request.values
        val = MySQLs().run(
            "update wraproject.pump_mission_list set site_condition  = '" + post_data[
                'site_condition'] + "', flood_deep = '" +
            post_data['flood_deep']
            + "', site_pic_url = '" + post_data['site_pic_url'] + "', dispatch_car_list = '" + post_data[
                'pump_car_list'] + "' where mission_id = '" + post_data['mission_id'] + "'")
        if val is not None:
            return {'status': "success"}
        else:
            return {'status': "fail"}


class LiffUploadImageController(MethodView):
    def get(self):
        pass

    def post(self):
        missionID = request.args.get('mission_id')
        static_tmp_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'images', 'disasterpics')
        filedata = request.files['Filedata']
        if filedata is not None:
            ext = filedata.filename.split('.')[1]
            filedata.save(os.path.join(static_tmp_path, secure_filename(missionID + "." + ext)))
        return {"success": "200"}


class LiffGetIDFromLine(MethodView):
    def get(self):
        liffKey = {"id": liffID}
        response = make_response(liffKey)
        response.status_code = 200
        return response

    def post(self):
        pass
