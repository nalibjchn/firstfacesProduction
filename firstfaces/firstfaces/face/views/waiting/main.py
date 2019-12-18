from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
from face.forms import UserForm, SignUpForm, SignUpUserForm
from django.contrib.auth.password_validation import validate_password
from django.http import JsonResponse
from face.utils import *
# from face.speech_to_text_utils import *
from django.utils import timezone
import json
from face.models import Conversation, Sentence, AudioFile, Profile, AudioError, AudioErrorAttempt, AudioErrorCorrectionAttempt
from django.conf import settings
from django.core.files.storage import FileSystemStorage
import code
#import soundfile as sf
import os
import time
import string
from operator import itemgetter
import datetime
import logging
from google.cloud import texttospeech
import math
from django.core.mail import send_mail
import re
import ast
from face.views.waiting.utils.availables import get_availables_for_schedule, create_list_of_javascript_available_times_from_django_objects, check_if_currently_in_class_or_class_finished
from face.views.waiting.utils.conversation import get_prev_conversations
from face.views.conversation.all.modify_data import jsonify_or_none, floatify

group_leader_dict = {

    "Beate": "FengChia",
    "john": "all",

}

@login_required
def waiting(request):
    
    # if it is a group leader then they will be redirected to the group_data page
    #try:
        #group_leader_dict[ request.user.username ]
        #return redirect('group_data')
    
    #except:
    
        user_profile = Profile.objects.get(learner=request.user)
        tutorial_complete = user_profile.tutorial_complete

        if tutorial_complete:

            time_now = timezone.localtime(timezone.now()).strftime("%H:%M")
            date_now = timezone.localtime(timezone.now()).date()

            groups = request.user.groups.values_list('name', flat=True)
            available_objects = get_availables_for_schedule(groups)
            availables = create_list_of_javascript_available_times_from_django_objects(available_objects)
            currently_in_class, class_finished_today = check_if_currently_in_class_or_class_finished(request.user)
            conversations = get_prev_conversations( request.user )

            # check if user has completed tutorial
            waiting_variables = {

                # 'schedule_dict': json.dumps(schedule_dict),
                # 'schedule_now': json.dumps(schedule_now),
                'conversations': conversations,
                'availables': availables,
                'tutorial_complete': tutorial_complete,
                'currently_in_class': currently_in_class,
                'class_finished_today': class_finished_today,
                'in_development': settings.DEBUG,
                # 'no_live_sessions': no_live_sessions,

            }

            # print('waiting_variables:', json.dumps(waiting_variables))
            context = {

                'waiting_variables': json.dumps(waiting_variables),
                'timeNowForNavbar': time_now,
                'waiting': True,

            }

            return render(request, 'face/waiting/main.html', context)

        else:
        
            # check if tutorial already open
            if Conversation.objects.filter(learner=request.user).count() == 1:
                
                conversation = Conversation.objects.filter(learner=request.user)[0]
                
            else:

                conversation = Conversation(learner=request.user, start_time=timezone.now(), topic="tutorial") 
                conversation.save()
            
            return redirect('conversation_student', conversation.id)

def book_conversation(request):

    user = request.user
    time_now = timezone.now()
    # tutorial = json.loads(request.POST['tutorial'])
    
    if user is not None:
        
        conversation = Conversation(learner=user, start_time=time_now) 
        conversation.save()

        # send_mail('Class booked by: ' + request.user.username, 'starts soon', 'ucd.erle@gmail.com', ['john.sloan.1@ucdconnect.ie'])

        response_data = {
            'conversationCreated': True,
            'conversation_id': conversation.id,
        }

    else:

        response_data = {
            'conversationCreated': False,
        }

    return JsonResponse(response_data)    
