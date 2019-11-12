from django.http import JsonResponse
from face.utils import *
from django.utils import timezone
import json
from face.models import Conversation, Sentence
import code
import time
import string
import math
import ast
from face.views.conversation.student.utils.store_sentence import change_sentence_to_list_n_add_data
from face.views.conversation.student.utils.check_for_judgement import for_prompt_arrived
from face.views.conversation.all.sentences import convert_django_sentence_object_to_json
from face.views.conversation.all.modify_data import jsonify_or_none, floatify
from face.views.conversation.all import database_updates

def store_sent(request):

    #code.interact(local=locals());

    time_now = timezone.now();
    sentence_text = request.POST['sent']
    sentence_data = change_sentence_to_list_n_add_data(sentence_text) #[[['a', 'DT', ['e']], ['boy', 'NNS', ['b', 'e', 'i']],...
    sentence_list = json.dumps([s[:2] for s in sentence_data]) # removes visemes cause don't need to store these in db

    # get session
    sent_id = request.POST['sent_id']
    conv = Conversation.objects.get(pk=int(request.POST['conversation_id']))

    s = Sentence.objects.get( pk=sent_id )
    s.sentence = sentence_list
    s.sentence_timestamp = time_now
    s.save()

    sent = convert_django_sentence_object_to_json(s, request.user.id, conv.id)
    
    # code.interact(local=locals());
    sent['sentence'] = sentence_data # for visemes to be added

    database_updates.database_updated_by_student = True
    # print('database_updated_by_student:', database_updates.database_updated_by_student)
    database_updates

    response_data = {

        'sentence': sent,

    }

    return JsonResponse(response_data)    

def check_judgement(request):

    sent_id = int(request.GET['sentId'])
    conv_id = int(request.GET['convId'])
    loop = int(request.GET['loop'])
    received_judgement = False
    received_judgement_n_for_prompt = False

    s = Sentence.objects.get(pk=sent_id)
    sent = {}

    if s.judgement != None:
                
        received_judgement = True

        if s.judgement in ["M", "B", "P"]:
            
            check_for_prompt_count = 0
            while not for_prompt_arrived(s):
                sleep(2)
                check_for_prompt_count += 1
                if check_for_prompt_count == 5:
                    break

            if check_for_prompt_count != 5:
                sent = convert_django_sentence_object_to_json(s, request.user.id, conv_id)
                s.loop = loop
                s.save()

        else: # C, X,  D and 3
            sent = convert_django_sentence_object_to_json(s, request.user.id, conv_id)
            s.loop = loop
            s.save()


    sent_meta = {
        'sentence': sent,
        'receivedJudgement': received_judgement,
    }

    return JsonResponse(sent_meta)    

def wait_for_correction(request):

    sent_id = int(request.GET['sentId'])

    sent_new = Sentence.objects.get(pk=sent_id)
        
    sent_new.indexes = sent_new.indexes
    response_data = {

        'correction': sent_new.correction,
        'indexes': sent_new.indexes,

    }

    return JsonResponse(response_data)    

def store_whats_wrong(request):

    sent_id = int(request.GET['sentId'])
    time_now = timezone.now();

    # code.interact(local=locals());
    sent = Sentence.objects.get(pk=sent_id)
    sent.whats_wrong = True
    sent.whats_wrong_timestamp = time_now
    sent.save()

    response_data = {
    }

    return JsonResponse(response_data)    

def store_try_again(request):

    sent_id = int(request.GET['sentId'])
    time_now = timezone.now();

    # code.interact(local=locals());
    sent = Sentence.objects.get(pk=sent_id)
    sent.try_again = True
    sent.try_again_timestamp = time_now
    sent.save()

    response_data = {
    }

    return JsonResponse(response_data)    

def store_next_sentence(request):

    sent_id = int(request.GET['sentId'])
    time_now = timezone.now();

    # code.interact(local=locals());
    sent = Sentence.objects.get(pk=sent_id)
    sent.next_sentence = True
    sent.next_sentence_timestamp = time_now
    sent.save()

    response_data = {
    }

    return JsonResponse(response_data)    

def store_show_correction(request):

    sent_id = int(request.GET['sentId'])
    time_now = timezone.now();

    # code.interact(local=locals());
    sent = Sentence.objects.get(pk=sent_id)
    sent.show_correction = True
    sent.show_correction_timestamp = time_now
    sent.save()

    response_data = {


    }

    return JsonResponse(response_data)    
