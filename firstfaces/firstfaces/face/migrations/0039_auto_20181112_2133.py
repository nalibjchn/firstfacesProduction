# Generated by Django 2.0 on 2018-11-12 21:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('face', '0038_auto_20181112_2120'),
    ]

    operations = [
        migrations.AlterField(
            model_name='audiofile',
            name='transcriptionChoicesView',
            field=models.CharField(default='[]', max_length=300),
        ),
        migrations.AlterField(
            model_name='permaudiofile',
            name='transcriptionChoicesView',
            field=models.CharField(default='[]', max_length=300),
        ),
    ]
