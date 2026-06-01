#!/bin/bash
echo 'Setting up Django+React...'
cd template/backend && pip install -r requirements.txt
cd ../frontend && npm install
echo 'Done!'
