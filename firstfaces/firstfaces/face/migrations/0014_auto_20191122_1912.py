# Generated by Django 2.0 on 2019-11-22 19:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('face', '0013_auto_20191122_1853'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stockphrases',
            name='urls',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='stockphrases',
            name='visemes',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
